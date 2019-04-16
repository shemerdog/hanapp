export const langCommon = {
  buttons: {
    save: "שמור",
    camcel: "ביטול",
    edit: "ערוך",

  },
  errorMsgs: {
    notFound: "מטופל לא קיים במערכת או שאין לך הרשאה",
    unknown: "שגיאה לא מוכרת",
    noConnection: "הפניה לשרת נכשלה, בדוק חיבור לרשת או נסה שוב",
  },
  labels: {

  }
};

export const createPatient = {
  firstNameLabel: "שם פרטי",
  lastNameLabel: "שם משפחה",
  idLabel: "ת.ז",
  phoneLabel: "טלפון",
  birthDateLabel: "תאריך לידה",
  emailLabel: "מייל",
  addressLabel: "כתובת",
  supervisorIdLabel: "ת.ז. מבוגר",
  requiredErrorMsg: "שדה חובה",
  emailErrorMsg: "כתובת מייל לא תקינה",
  invalidFormMsg: "תקן את השדות האדומים ונסה שוב!",
  serverErrorDuplicateMsg: "ת.ז. קיימת במערכת!",
  serverErrorMsg: "בעיה בשרתים, אנא נסה שוב או פנה לבוס המעצבן שלי",
  titleEdit: "עריכת",
  titleCreate: "יצירת",
  titleSupervisor: "מבוגר אחראי",
  titlePatient: "מטופל",
  dialogTitle: "המידע נשלח",
  dialogText: "יצרת מטופל חדש בהצלחה!",
}

export const createPractice = {
  proNameLabel: "שם מקצועי",
  nameLabel: "שם התרגיל",
  proDescriptionLabel: "תיאור מקצועי",
  descriptionLabel: "תיאור התרגיל",
  purposeLabel: "מטרת התרגיל",
  defaultDurationLabel: "משך התרגיל",
  defaultRepeatitionLabel: "מספר חזרות",
  tagsLabel: "תגיות",
  tagsHelperText: "תגית1,תגית2,תגית3...",
  serverErrorDuplicateMsg: "תרגיל בשם זה כבר קיים, ניתן לערוך אותו או לצור תרגיל חדש",
  addMaterialLabel: "הוסף מקורות",
  buttonSaveLabel: "שמור",
  materialsTypeLabel: "סוג",
  materialsSrcLabel: "כתובת מקור",
}

export const login = {
  header: "hanApp",
  userNameLabel: "שם משתמש",
  passwordLabel: "סיסמה",
  forgotPasswordLabel: "שכחת את הסיסמה?",
  loginButtonLabel: "התחבר",
  loginGoogleLabel: "Login with Google",
  loginFacebookLabel: "Login with Facebook",
  dialogTitle: "חבל מאוד!",
  dialogText: "בעיה שלך, פעם הבאה אל תשכח.",
  loginErrorText: "שם משתמש או סיסמה אינם נכונים",
};

export const navbar = {
logoutLabel: "Logout",
loginLabel: "Login",
greetingText: "שלום ", // adding username after the space
dialogTitle: "אתה לא מחובר",
dialogText: "צריך להתחבר כדי לבצע פעולה זאת",
};

export const nextAppointment = {
  nextAppointmentLabel: "פגישה הבאה",
  nextAppointmentsText: "אין פגישות ביומן!",
  addAppointmentLabel: "הוסף פגישה",
  nextAppointmentsLabel: "פגישות הבאות:",
  addNewAppointmentLebel: "קבע פגישה חדשה",
  buttonSaveLabel: "שמור פגישה",
};

export const patientDetails = {
  patientLabels: {
  	firstName: "שם פרטי",
  	lastName: "שם משפחה",
  	id: "ת.ז",
  	phone: "טלפון",
  	birthDate: "תאריך לידה",
  	email: "מייל",
  	address: "כתובת",
  	supervisorId: "מבוגר אחראי"
  },
  numToDay: {
  	0: "ראשון",
  	1: "שני",
  	2: "שלישי",
  	3: "רביעי",
  	4: "חמישי",
  	5: "שישי",
  	6: "שבת",
  },

  dialogTitle: "מחיקת מטופל",
  dialogText: "אתה בטוח שאתה רוצה למחוק?",
};

export const patientHistory = {
  addPracticeLabel: "הוסף תרגיל",
  editAppointmentLabel: "עריכת פגישה",
  practiceListLabel: "רשימת תרגילים",
  noAppointmentsErrorMsg: "אין פגישות בהיסטוריה!",
};

export const patient = {
  header: "פרטי מטופל",
  detailsTabLabel: "פרטים",
  historyTabLabel: "היסטורית פגישות",
}
