-- Update Patient 1
UPDATE public.profiles
SET preferences = '{
  "patient_record": {
    "vitals": {
      "blood_pressure": "118/76 mmHg",
      "heart_rate": "68 bpm",
      "spo2": "99%",
      "temperature": "98.2°F"
    },
    "meds_plan": [
      {"time": "08:30 AM", "name": "Fluoxetine 20mg", "instructions": "Take after breakfast"},
      {"time": "09:00 PM", "name": "Vitamin D3", "instructions": "Take with milk"}
    ],
    "test_schedule": [
      {"date": "2026-08-15", "name": "Renal Function Test", "location": "Lab Block B"},
      {"date": "2026-08-20", "name": "Cognitive Behavioral Review", "location": "Therapy Wing"}
    ],
    "appointments": [
      {"date": "2026-08-11 at 11:00 AM", "doctor": "Dr. Karthik (Psychiatrist)", "type": "Follow-up"},
      {"date": "2026-08-16 at 03:00 PM", "doctor": "Counselor Anand", "type": "Counseling"}
    ],
    "demographics": {
      "age": 18,
      "sex": "Male",
      "height": "172 cm",
      "weight": "63 kg",
      "blood_group": "A+",
      "living_environment": "Rehabilitation Villa A, Single Room"
    }
  }
}'::jsonb
WHERE id = (SELECT id FROM auth.users WHERE email = 'patient1@youmecareall.com');

-- Update Patient 2
UPDATE public.profiles
SET preferences = '{
  "patient_record": {
    "vitals": {
      "blood_pressure": "112/70 mmHg",
      "heart_rate": "74 bpm",
      "spo2": "98%",
      "temperature": "98.4°F"
    },
    "meds_plan": [
      {"time": "08:00 AM", "name": "Sertraline 50mg", "instructions": "Take after meal"},
      {"time": "01:30 PM", "name": "B-Complex Forte", "instructions": "Take after lunch"},
      {"time": "09:30 PM", "name": "Clonazepam 0.25mg", "instructions": "Take 30 mins before sleep"}
    ],
    "test_schedule": [
      {"date": "2026-08-12", "name": "Complete Blood Count", "location": "Lab Block A"},
      {"date": "2026-08-28", "name": "EEG Baseline Review", "location": "Neurology Wing"}
    ],
    "appointments": [
      {"date": "2026-08-14 at 10:00 AM", "doctor": "Dr. Karthik (Psychiatrist)", "type": "Routine Evaluation"},
      {"date": "2026-08-19 at 04:00 PM", "doctor": "Counselor Anand", "type": "CBT Session"}
    ],
    "demographics": {
      "age": 24,
      "sex": "Female",
      "height": "160 cm",
      "weight": "54 kg",
      "blood_group": "O+",
      "living_environment": "Rehabilitation Villa B, Shared Room"
    }
  }
}'::jsonb
WHERE id = (SELECT id FROM auth.users WHERE email = 'patient2@youmecareall.com');

-- Update Patient 3
UPDATE public.profiles
SET preferences = '{
  "patient_record": {
    "vitals": {
      "blood_pressure": "122/80 mmHg",
      "heart_rate": "80 bpm",
      "spo2": "97%",
      "temperature": "98.6°F"
    },
    "meds_plan": [
      {"time": "09:00 AM", "name": "Aripiprazole 10mg", "instructions": "Take after breakfast"},
      {"time": "09:00 PM", "name": "Omega-3 Fish Oil", "instructions": "Take after dinner"}
    ],
    "test_schedule": [
      {"date": "2026-08-18", "name": "Liver Function Test", "location": "Lab Block B"},
      {"date": "2026-08-30", "name": "Social Adaptation Scale Assessment", "location": "Day Care Block"}
    ],
    "appointments": [
      {"date": "2026-08-13 at 09:30 AM", "doctor": "Dr. Karthik (Psychiatrist)", "type": "Treatment Review"},
      {"date": "2026-08-21 at 11:30 AM", "doctor": "Counselor Anand", "type": "Family Session"}
    ],
    "demographics": {
      "age": 32,
      "sex": "Male",
      "height": "178 cm",
      "weight": "79 kg",
      "blood_group": "B+",
      "living_environment": "Independent Living Annex, Shared Apartment"
    }
  }
}'::jsonb
WHERE id = (SELECT id FROM auth.users WHERE email = 'patient3@youmecareall.com');

-- Update Patient 4
UPDATE public.profiles
SET preferences = '{
  "patient_record": {
    "vitals": {
      "blood_pressure": "128/84 mmHg",
      "heart_rate": "88 bpm",
      "spo2": "96%",
      "temperature": "99.0°F"
    },
    "meds_plan": [
      {"time": "08:00 AM", "name": "Escitalopram 10mg", "instructions": "Take with warm water"},
      {"time": "02:00 PM", "name": "Thyroxine 50mcg", "instructions": "Take before lunch (empty stomach)"},
      {"time": "10:00 PM", "name": "Zolpidem 5mg", "instructions": "Take strictly at bedtime"}
    ],
    "test_schedule": [
      {"date": "2026-08-14", "name": "Thyroid Profile (T3, T4, TSH)", "location": "Main Lab"},
      {"date": "2026-08-24", "name": "Anxiety Rating Inventory", "location": "Consultation Room 3"}
    ],
    "appointments": [
      {"date": "2026-08-15 at 12:30 PM", "doctor": "Dr. Karthik (Psychiatrist)", "type": "Clinical Audit"},
      {"date": "2026-08-20 at 02:30 PM", "doctor": "Counselor Anand", "type": "Individual Therapy"}
    ],
    "demographics": {
      "age": 40,
      "sex": "Female",
      "height": "158 cm",
      "weight": "68 kg",
      "blood_group": "O-",
      "living_environment": "Rehabilitation Villa C, Single Room"
    }
  }
}'::jsonb
WHERE id = (SELECT id FROM auth.users WHERE email = 'patient4@youmecareall.com');

-- Update Patient 5
UPDATE public.profiles
SET preferences = '{
  "patient_record": {
    "vitals": {
      "blood_pressure": "130/85 mmHg",
      "heart_rate": "76 bpm",
      "spo2": "99%",
      "temperature": "98.3°F"
    },
    "meds_plan": [
      {"time": "08:00 AM", "name": "Lithium Carbonate 300mg", "instructions": "Take with food"},
      {"time": "08:00 PM", "name": "Lithium Carbonate 300mg", "instructions": "Take after dinner"}
    ],
    "test_schedule": [
      {"date": "2026-08-11", "name": "Serum Lithium Level check", "location": "Lab Block A"},
      {"date": "2026-08-22", "name": "Bipolar Spectrum Scale Interview", "location": "Therapy Block C"}
    ],
    "appointments": [
      {"date": "2026-08-12 at 03:30 PM", "doctor": "Dr. Karthik (Psychiatrist)", "type": "Dosage Check"},
      {"date": "2026-08-25 at 10:00 AM", "doctor": "Counselor Anand", "type": "Counseling Session"}
    ],
    "demographics": {
      "age": 47,
      "sex": "Male",
      "height": "174 cm",
      "weight": "74 kg",
      "blood_group": "AB+",
      "living_environment": "Rehabilitation Villa A, Shared Room"
    }
  }
}'::jsonb
WHERE id = (SELECT id FROM auth.users WHERE email = 'patient5@youmecareall.com');

-- Update Patient 6
UPDATE public.profiles
SET preferences = '{
  "patient_record": {
    "vitals": {
      "blood_pressure": "135/88 mmHg",
      "heart_rate": "82 bpm",
      "spo2": "98%",
      "temperature": "98.5°F"
    },
    "meds_plan": [
      {"time": "09:00 AM", "name": "Duloxetine 30mg", "instructions": "Take after breakfast"},
      {"time": "02:00 PM", "name": "Calcium Carbonate", "instructions": "Take after lunch"},
      {"time": "09:00 PM", "name": "Gabapentin 100mg", "instructions": "Take before sleep"}
    ],
    "test_schedule": [
      {"date": "2026-08-16", "name": "Bone Density Screening", "location": "Radiology block"},
      {"date": "2026-08-29", "name": "Depression Severity Inventory", "location": "Consultation Room 1"}
    ],
    "appointments": [
      {"date": "2026-08-17 at 11:30 AM", "doctor": "Dr. Karthik (Psychiatrist)", "type": "Routine Evaluation"},
      {"date": "2026-08-22 at 04:00 PM", "doctor": "Counselor Anand", "type": "CBT Session"}
    ],
    "demographics": {
      "age": 55,
      "sex": "Female",
      "height": "154 cm",
      "weight": "62 kg",
      "blood_group": "A-",
      "living_environment": "Elderly Care Cottage 2, single occupancy"
    }
  }
}'::jsonb
WHERE id = (SELECT id FROM auth.users WHERE email = 'patient6@youmecareall.com');

-- Update Patient 7
UPDATE public.profiles
SET preferences = '{
  "patient_record": {
    "vitals": {
      "blood_pressure": "140/90 mmHg",
      "heart_rate": "70 bpm",
      "spo2": "95%",
      "temperature": "98.1°F"
    },
    "meds_plan": [
      {"time": "08:00 AM", "name": "Donepezil 5mg", "instructions": "Take after breakfast"},
      {"time": "02:00 PM", "name": "Multivitamin Senior", "instructions": "Take with water"},
      {"time": "09:00 PM", "name": "Quetiapine 25mg", "instructions": "Take strictly before sleep"}
    ],
    "test_schedule": [
      {"date": "2026-08-19", "name": "MRI Brain Scan (Baseline)", "location": "Imaging block"},
      {"date": "2026-08-26", "name": "Mini-Mental State Examination", "location": "Psychology wing"}
    ],
    "appointments": [
      {"date": "2026-08-13 at 02:00 PM", "doctor": "Dr. Karthik (Psychiatrist)", "type": "Memory Clinic Assessment"},
      {"date": "2026-08-20 at 10:30 AM", "doctor": "Counselor Anand", "type": "Cognitive Training"}
    ],
    "demographics": {
      "age": 62,
      "sex": "Male",
      "height": "168 cm",
      "weight": "70 kg",
      "blood_group": "B-",
      "living_environment": "Elderly Care Cottage 1, shared caregiver room"
    }
  }
}'::jsonb
WHERE id = (SELECT id FROM auth.users WHERE email = 'patient7@youmecareall.com');

-- Update Patient 8
UPDATE public.profiles
SET preferences = '{
  "patient_record": {
    "vitals": {
      "blood_pressure": "142/92 mmHg",
      "heart_rate": "64 bpm",
      "spo2": "94%",
      "temperature": "97.9°F"
    },
    "meds_plan": [
      {"time": "08:30 AM", "name": "Memantine 10mg", "instructions": "Take after food"},
      {"time": "08:30 PM", "name": "Memantine 10mg", "instructions": "Take after dinner"}
    ],
    "test_schedule": [
      {"date": "2026-08-14", "name": "Basic Metabolic Panel", "location": "Lab Block B"},
      {"date": "2026-08-21", "name": "Gait and Balance Evaluation", "location": "Physiotherapy Block"}
    ],
    "appointments": [
      {"date": "2026-08-15 at 10:00 AM", "doctor": "Dr. Karthik (Psychiatrist)", "type": "Geriatric Review"},
      {"date": "2026-08-22 at 03:00 PM", "doctor": "Counselor Anand", "type": "Memory Therapy"}
    ],
    "demographics": {
      "age": 70,
      "sex": "Female",
      "height": "150 cm",
      "weight": "50 kg",
      "blood_group": "AB-",
      "living_environment": "Assisted Living Block F, single ground floor room"
    }
  }
}'::jsonb
WHERE id = (SELECT id FROM auth.users WHERE email = 'patient8@youmecareall.com');

-- Update Patient 9
UPDATE public.profiles
SET preferences = '{
  "patient_record": {
    "vitals": {
      "blood_pressure": "100/60 mmHg",
      "heart_rate": "90 bpm",
      "spo2": "99%",
      "temperature": "98.6°F"
    },
    "meds_plan": [
      {"time": "08:00 AM", "name": "Methylphenidate 10mg", "instructions": "Take after breakfast"},
      {"time": "02:00 PM", "name": "Omega-3 Gummy", "instructions": "Chew after lunch"}
    ],
    "test_schedule": [
      {"date": "2026-08-17", "name": "Pediatric Growth & Vital Audit", "location": "Pediatric Clinic"},
      {"date": "2026-08-24", "name": "ADHD Symptom Scale Review", "location": "Consultation Room 5"}
    ],
    "appointments": [
      {"date": "2026-08-11 at 04:00 PM", "doctor": "Dr. Karthik (Psychiatrist)", "type": "Pediatric Evaluation"},
      {"date": "2026-08-19 at 05:00 PM", "doctor": "Counselor Anand", "type": "Play Therapy Session"}
    ],
    "demographics": {
      "age": 8,
      "sex": "Male",
      "height": "125 cm",
      "weight": "28 kg",
      "blood_group": "O+",
      "living_environment": "Childhood Development Unit, Playroom access"
    }
  }
}'::jsonb
WHERE id = (SELECT id FROM auth.users WHERE email = 'patient9@youmecareall.com');

-- Update Patient 10
UPDATE public.profiles
SET preferences = '{
  "patient_record": {
    "vitals": {
      "blood_pressure": "105/65 mmHg",
      "heart_rate": "84 bpm",
      "spo2": "99%",
      "temperature": "98.4°F"
    },
    "meds_plan": [
      {"time": "08:00 AM", "name": "Fluoxetine 10mg", "instructions": "Take after breakfast"},
      {"time": "09:00 PM", "name": "Calcium Gummy", "instructions": "Chew before sleep"}
    ],
    "test_schedule": [
      {"date": "2026-08-13", "name": "Adolescent Health Audit", "location": "Main Lab"},
      {"date": "2026-08-27", "name": "Self-Esteem Inventory Assessment", "location": "Consultation Room 4"}
    ],
    "appointments": [
      {"date": "2026-08-12 at 01:00 PM", "doctor": "Dr. Karthik (Psychiatrist)", "type": "Adolescent Follow-up"},
      {"date": "2026-08-18 at 03:30 PM", "doctor": "Counselor Anand", "type": "CBT Session"}
    ],
    "demographics": {
      "age": 15,
      "sex": "Female",
      "height": "158 cm",
      "weight": "48 kg",
      "blood_group": "A+",
      "living_environment": "Adolescent Care Wing, shared cottage"
    }
  }
}'::jsonb
WHERE id = (SELECT id FROM auth.users WHERE email = 'patient10@youmecareall.com');
