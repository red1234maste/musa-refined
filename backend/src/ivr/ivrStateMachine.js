const Report = require('../models/Report');
const Farmer = require('../models/Farmer');
const { runClusteringPass } = require('../services/clustering');

const sessions = {};

const PROMPTS = {
  en: {
    WELCOME: 'Welcome to FieldWatch Toll-Free Advisory. Press 1 for Hindi, 2 for Marathi, 3 for English.',
    SELECT_CROP: 'Select crop: Press 1 for Wheat, 2 for Rice, 3 for Cotton, 4 for Maize, 5 for Tomato.',
    SELECT_SYMPTOM: 'Select symptom: Press 1 for Leaf Spots, 2 for Wilting, 3 for Insect Damage, 4 for Yellowing.',
    CONFIRM_SUBMIT: 'Press 1 to confirm pest report submission, or press 0 to cancel.',
    COMPLETED: 'Thank you! Your pest report has been ingested via IVR. Stay safe.'
  },
  hi: {
    WELCOME: 'फील्डवॉच टोल-फ्री कीट सहायता सेवा में आपका स्वागत है। हिंदी के लिए 1 दबाएं। मराठी के लिए 2 दबाएं। अंग्रेजी के लिए 3 दबाएं।',
    SELECT_CROP: 'अपनी फसल चुनें: गेहूं के लिए 1, धान के लिए 2, कपास के लिए 3, मक्का के लिए 4, टमाटर के लिए 5 दबाएं।',
    SELECT_SYMPTOM: 'लक्षण चुनें: पत्तियों के धब्बों के लिए 1, मुरझाने के लिए 2, कीड़ों के प्रकोप के लिए 3, पीलेपन के लिए 4 दबाएं।',
    CONFIRM_SUBMIT: 'कीट प्रकोप रिपोर्ट दर्ज करने के लिए 1 दबाएं, या रद्द करने के लिए 0 दबाएं।',
    COMPLETED: 'धन्यवाद! आपकी कीट रिपोर्ट सफलतापूर्वक दर्ज कर ली गई है।'
  },
  mr: {
    WELCOME: 'फिल्डवॉच टोल-फ्री कीटक सल्ला सेवेत आपले स्वागत आहे. हिंदीसाठी 1 दाबा. मराठीसाठी 2 दाबा. इंग्रजीसाठी 3 दाबा.',
    SELECT_CROP: 'आपले पीक निवडा: गव्हासाठी 1, भातासाठी 2, कापासासाठी 3, मक्यासाठी 4, टोमॅटोसाठी 5 दाबा.',
    SELECT_SYMPTOM: 'लक्षण निवडा: पानांवरील डागांसाठी 1, सुकण्यासाठी 2, कीटकांच्या प्रादुर्भावासाठी 3, पिवळेपणासाठी 4 दाबा.',
    CONFIRM_SUBMIT: 'अहवाल नोंदवण्यासाठी 1 दाबा, किंवा रद्द करण्यासाठी 0 दाबा.',
    COMPLETED: 'धन्यवाद! तुमची नोंद यशस्वीरीत्या स्वीकारली गेली आहे.'
  }
};

const SYMPTOM_MAP = {
  '1': 'Leaf Spots / Rust',
  '2': 'Wilting / Stunting',
  '3': 'Insect Damage / Worms',
  '4': 'Yellowing / Discoloration'
};

const CROP_MAP = {
  '1': 'Wheat',
  '2': 'Rice / Paddy',
  '3': 'Cotton',
  '4': 'Maize / Corn',
  '5': 'Tomato'
};

function handleIVRStep(sessionId, dtmfInput, farmerPhone = '9876543210') {
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      sessionId,
      step: 'WELCOME',
      language: 'hi', // Default to Hindi as in Nagriksetu / SIH-project-main
      crop: 'Wheat',
      symptom: 'Insect Damage / Worms',
      farmerPhone
    };

    return {
      step: 'WELCOME',
      prompt: PROMPTS.hi.WELCOME,
      sessionId,
      language: 'hi'
    };
  }

  const session = sessions[sessionId];

  switch (session.step) {
    case 'WELCOME': {
      if (dtmfInput === '1') session.language = 'hi';
      else if (dtmfInput === '2') session.language = 'mr';
      else if (dtmfInput === '3') session.language = 'en';
      else session.language = 'hi';

      session.step = 'SELECT_CROP';
      const langPrompts = PROMPTS[session.language] || PROMPTS.hi;
      return {
        step: 'SELECT_CROP',
        prompt: langPrompts.SELECT_CROP,
        sessionId,
        language: session.language
      };
    }
    case 'SELECT_CROP': {
      session.crop = CROP_MAP[dtmfInput] || 'Wheat';
      session.step = 'SELECT_SYMPTOM';
      const langPrompts = PROMPTS[session.language] || PROMPTS.hi;
      return {
        step: 'SELECT_SYMPTOM',
        prompt: langPrompts.SELECT_SYMPTOM,
        sessionId,
        language: session.language
      };
    }
    case 'SELECT_SYMPTOM': {
      session.symptom = SYMPTOM_MAP[dtmfInput] || 'Insect Damage / Worms';
      session.step = 'CONFIRM_SUBMIT';
      const langPrompts = PROMPTS[session.language] || PROMPTS.hi;
      return {
        step: 'CONFIRM_SUBMIT',
        prompt: langPrompts.CONFIRM_SUBMIT,
        sessionId,
        language: session.language
      };
    }
    case 'CONFIRM_SUBMIT': {
      const langPrompts = PROMPTS[session.language] || PROMPTS.hi;
      if (dtmfInput === '1' || dtmfInput === '#') {
        session.step = 'COMPLETED';
        return {
          step: 'COMPLETED',
          prompt: langPrompts.COMPLETED,
          sessionId,
          shouldIngest: true,
          sessionData: session,
          language: session.language
        };
      } else {
        delete sessions[sessionId];
        return {
          step: 'CANCELLED',
          prompt: 'Session cancelled.',
          sessionId
        };
      }
    }
    default:
      return { step: 'COMPLETED', prompt: PROMPTS.hi.COMPLETED, sessionId, language: 'hi' };
  }
}

async function ingestIVRReport(sessionData) {
  let farmer = await Farmer.findOne({ phone: sessionData.farmerPhone });
  if (!farmer) {
    farmer = new Farmer({
      name: 'IVR Caller Farmer',
      phone: sessionData.farmerPhone,
      preferred_language: sessionData.language || 'hi'
    });
    await farmer.save();
  }

  const newReport = new Report({
    farmer_id: farmer._id,
    channel: 'ivr',
    field_id: `FIELD_IVR_${Math.floor(100 + Math.random() * 900)}`,
    crop_type: sessionData.crop,
    symptoms: [sessionData.symptom],
    preferred_language: sessionData.language,
    location: {
      type: 'Point',
      coordinates: [75.7139 + (Math.random() - 0.5) * 0.01, 19.7515 + (Math.random() - 0.5) * 0.01]
    },
    cv_result: {
      is_valid_image: true,
      confidence: 0.5,
      pest_type: 'Fall Armyworm',
      is_duplicate: false
    },
    status: 'verified_valid'
  });

  await newReport.save();
  await runClusteringPass();

  return newReport;
}

module.exports = { handleIVRStep, ingestIVRReport, PROMPTS };
