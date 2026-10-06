export interface SampleReport {
  id: string;
  title: string;
  modality: string;
  badge: string;
  badgeColor: string;
  description: string;
  rawText: string;
  pageCount: number;
}

export const SAMPLE_REPORTS: SampleReport[] = [
  {
    id: "pe-critical-ct",
    title: "⚡ 30s Judge Demo: Acute Pulmonary Embolism",
    modality: "CT Chest with IV Contrast (PE Protocol)",
    badge: "CRITICAL ALERT",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    description: "Multi-page contrast-enhanced CT demonstrating right lower lobe pulmonary embolism with important negative findings.",
    pageCount: 5,
    rawText: `METROPOLITAN UNIVERSITY HOSPITAL - DEPARTMENT OF RADIOLOGY
CONFIDENTIAL MEDICAL REPORT
DEMO DATA — NOT A REAL PATIENT

PATIENT INFORMATION:
Name: DOE, ELEANOR
Patient ID: RAD-984210
Age: 58 years | Sex: Female
DOB: 1968-04-12
Exam Date: 2026-10-06 09:14 EST
Referring Physician: Dr. Marcus Vance, MD (Emergency Medicine)
Accession Number: ACC-2026-88319

EXAMINATION:
CT CHEST WITH INTRAVENOUS CONTRAST (PULMONARY EMBOLISM PROTOCOL)

CLINICAL INDICATION:
58-year-old female presenting with acute onset pleuritic chest pain, sinus tachycardia (HR 115 bpm), and hypoxemia on room air (SpO2 91%). D-dimer elevated at 2,450 ng/mL. Rule out pulmonary embolism.

TECHNIQUE:
Axial helical computed tomography of the thorax obtained from lung apices to adrenal glands following intravenous administration of 80 mL Isovue-370 via right antecubital vein. Bolus tracking initiated in the main pulmonary trunk. Multiplanar reformations in coronal and sagittal planes generated. Dose reduction algorithms employed.

COMPARISON:
None available.

================================================================================
FINDINGS:
================================================================================

PULMONARY VASCULATURE:
There is an intraluminal filling defect within the proximal and distal right lower lobe pulmonary artery, with extension into the posterior and lateral basal segmental branches. The main pulmonary trunk is of normal caliber, measuring 25 mm. The left pulmonary arterial tree is patent throughout without evidence of filling defect. The right ventricle to left ventricle diameter ratio is 0.85, without evidence of acute right ventricular strain or septal flattening.

MEDIASTINUM AND HILA:
Mediastinal and hilar lymph nodes are within normal size limits. The thoracic aorta is normal in caliber with smooth contour. No aortic dissection or aneurysm. The superior vena cava and azygos vein are unremarkable.

CARDIAC AND PERICARDIUM:
Cardiac silhouette is normal in size. No pericardial effusion is seen. The coronary arteries exhibit minimal non-obstructive calcification.

LUNG PARENCHYMA AND AIRWAYS:
Subsegmental wedge-shaped peripheral ground-glass density in the right lower lobe posterior base, suspicious for early pulmonary infarction. Trachea and central bronchi are widely patent. No endobronchial lesions. No consolidation, cavitation, or mass. No pneumothorax.

PLEURAL SPACES:
Trace reactive right pleural effusion noted. No left pleural effusion. No evidence of pneumothorax or hemothorax.

CHEST WALL AND LOWER NECK:
Thyroid gland is symmetrical without suspicious nodule. Soft tissues of the chest wall are unremarkable.

ABDOMINAL VISUALIZATION:
Visualized upper abdominal organs including liver, spleen, and adrenal glands are unremarkable.

OSSEOUS STRUCTURES:
No acute fracture or suspicious osteolytic or osteoblastic osseous lesions. Mild degenerative spondylosis of the thoracic spine.

================================================================================
IMPRESSION:
================================================================================
1. ACUTE PULMONARY EMBOLISM: Filling defect within the right lower lobe pulmonary artery extending into segmental branches as detailed above.
2. No evidence of right ventricular enlargement or acute right heart strain (RV/LV ratio 0.85).
3. Peripheral wedge-shaped opacity in the right lower lobe consistent with focal pulmonary infarction.
4. No pneumothorax or large pleural effusion.
5. Critical finding notified to Dr. Vance (Emergency Department) via telephone on 2026-10-06 at 09:42 EST.

RECOMMENDATIONS:
1. Urgent evaluation for initiation of therapeutic anticoagulation per clinical protocol.
2. Clinical assessment by Pulmonary Embolism Response Team (PERT) if patient develops hemodynamic instability.
3. Consider lower extremity venous duplex ultrasound to evaluate for deep vein thrombosis source.`,
  },
  {
    id: "appendicitis-urgent",
    title: "Acute Appendicitis with Reactive Fluid",
    modality: "CT Abdomen and Pelvis with IV Contrast",
    badge: "URGENT",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Classic acute surgical abdomen presentation requiring urgent surgical intervention.",
    pageCount: 3,
    rawText: `METROPOLITAN UNIVERSITY HOSPITAL - DEPARTMENT OF RADIOLOGY
CONFIDENTIAL MEDICAL REPORT
DEMO DATA — NOT A REAL PATIENT

PATIENT INFORMATION:
Name: CHEN, MICHAEL
Patient ID: RAD-771942
Age: 34 years | Sex: Male
Exam Date: 2026-10-06 11:30 EST
Referring Physician: Dr. Sarah Lin, MD (Surgery)

EXAMINATION:
CT ABDOMEN AND PELVIS WITH INTRAVENOUS CONTRAST

CLINICAL INDICATION:
34-year-old male with 24 hours of periumbilical pain migrating to right lower quadrant. Rebound tenderness present. Leukocytosis (WBC 16.2). Evaluate for acute appendicitis.

FINDINGS:
GASTROINTESTINAL TRACT:
The appendix is dilated, measuring 11 mm in maximal outer diameter, with mural hyperenhancement and surrounding periappendiceal fat stranding. A 4 mm appendicolith is identified at the base of the appendix. A small focus of fluid is noted adjacent to the appendiceal tip. No extraluminal free air or organized phlegmon. The cecum shows mild reactive wall thickening. Stomach, small bowel, and remaining colon are normal in caliber.

SOLID ORGANS:
Liver, gallbladder, biliary tree, spleen, pancreas, and adrenal glands are within normal limits. Kidneys demonstrate symmetric enhancement without hydronephrosis or calculi.

PERITONEUM:
No free intraperitoneal air. Small volume reactive pelvic free fluid. No lymphadenopathy.

VASCULAR & OSSEOUS:
Abdominal aorta is normal caliber. No acute osseous abnormality.

IMPRESSION:
1. Acute appendicitis with appendicolith and localized periappendiceal inflammatory stranding.
2. No evidence of free perforation or formed abscess.
3. Small amount of reactive pelvic free fluid.

RECOMMENDATIONS:
1. Urgent general surgery evaluation for appendectomy.
2. Preoperative antibiotic therapy as clinically indicated.`,
  },
  {
    id: "normal-brain-mri",
    title: "Normal Brain MRI (Stroke Protocol)",
    modality: "MRI Brain without Contrast",
    badge: "NORMAL / ROUTINE",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Unremarkable neurological examination showing negative findings and normal parenchymal architecture.",
    pageCount: 2,
    rawText: `METROPOLITAN UNIVERSITY HOSPITAL - DEPARTMENT OF RADIOLOGY
CONFIDENTIAL MEDICAL REPORT
DEMO DATA — NOT A REAL PATIENT

PATIENT INFORMATION:
Name: REYNOLDS, ARTHUR
Patient ID: RAD-610293
Age: 62 years | Sex: Male
Exam Date: 2026-10-06 08:00 EST
Referring Physician: Dr. Elena Rostova, MD (Neurology)

EXAMINATION:
MRI BRAIN WITHOUT CONTRAST (ACUTE STROKE PROTOCOL)

CLINICAL INDICATION:
Transient dizziness and sensory numbness in left arm, now resolved. Rule out acute ischemic stroke.

TECHNIQUE:
Multiplanar multisequence MRI of the brain performed on a 3.0 Tesla scanner including DWI, ADC, FLAIR, T2, T1, and GRE sequences.

FINDINGS:
BRAIN PARENCHYMA:
Diffusion-weighted imaging (DWI) demonstrates no areas of restricted diffusion to suggest acute or hyperacute ischemic infarction. On FLAIR and T2-weighted sequences, there is no evidence of intracranial mass, edema, or midline shift. Gray-white differentiation is preserved. Age-appropriate minimal periventricular T2 hyperintensities consistent with chronic microvascular ischemic changes.

VENTRICLES AND EXTRA-AXIAL SPACES:
Ventricular system and basal cisterns are normal in size and configuration for age. No hydrocephalus. No extra-axial fluid collections or subdural hematoma.

HEMORRHAGE SCREENING:
Gradient echo (GRE) sequences reveal no evidence of acute or chronic intracranial hemorrhage, microhemorrhages, or vascular malformation.

CALVARIUM AND ORBITS:
Calvarium and skull base are intact. Visualized orbits, paranasal sinuses, and mastoid air cells are clear.

IMPRESSION:
1. No evidence of acute ischemic infarction or restricted diffusion.
2. No intracranial hemorrhage, mass effect, or midline shift.
3. Mild chronic microvascular ischemic changes typical for age.

RECOMMENDATIONS:
1. Outpatient risk factor modification and neurovascular follow-up as clinically appropriate.`,
  },
  {
    id: "contradiction-safety-demo",
    title: "⚠️ Safety Audit Demo: Contradiction Check",
    modality: "Chest Radiograph (CXR 2-Views)",
    badge: "CONTRADICTION DETECTED",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    description: "Designed specifically to demonstrate the Negation & Contradiction Safety Engine detecting clinical discordance between Findings and Impression.",
    pageCount: 2,
    rawText: `METROPOLITAN UNIVERSITY HOSPITAL - DEPARTMENT OF RADIOLOGY
CONFIDENTIAL MEDICAL REPORT
DEMO DATA — NOT A REAL PATIENT

PATIENT INFORMATION:
Name: HASTINGS, DAVID
Patient ID: RAD-442190
Age: 47 years | Sex: Male
Exam Date: 2026-10-06 10:20 EST
Referring Physician: Dr. Alan Grant, MD (Pulmonology)

EXAMINATION:
CHEST RADIOGRAPH 2-VIEWS (PA AND LATERAL)

CLINICAL INDICATION:
Post-procedure thoracentesis follow-up. Assess for residual fluid or complication.

FINDINGS:
LUNGS AND PLEURA:
There is a small right apical pneumothorax measuring approximately 1.2 cm from the apex to the thoracic cupola. The left lung remains clear and fully expanded without consolidation or pneumothorax. Blunting of the right costophrenic angle is significantly improved from prior examination. Trachea is midline.

CARDIOMEDIASTINAL SILHOUETTE:
Cardiac size is within normal limits. Mediastinum and hila are unremarkable.

OSSEOUS STRUCTURES:
Intact ribs and clavicles bilaterally.

IMPRESSION:
1. Resolved right pleural effusion following intervention.
2. No pneumothorax. Lungs are clear.
3. Stable cardiomediastinal contour.

RECOMMENDATIONS:
1. Routine clinical follow-up.`,
  },
];
