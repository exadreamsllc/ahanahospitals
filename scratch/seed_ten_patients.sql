-- 1. Insert 10 Patients and 5 Clinical/Staff Users into auth.users
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, 
  last_sign_in_at, created_at, updated_at, 
  raw_app_meta_data, raw_user_meta_data, is_super_admin, is_anonymous, is_sso_user, 
  deleted_at, confirmation_token, email_change, email_change_confirm_status, 
  email_change_token_current, email_change_token_new, phone_change, phone_change_token, 
  reauthentication_token, recovery_token
)
VALUES
  -- Patients
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa01', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'patient1@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Arun Kumar", "preferred_language": "en", "account_type": "Member", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "patient1@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa01"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa02', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'patient2@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Divya Bharathi", "preferred_language": "ta", "account_type": "Member", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "patient2@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa02"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa03', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'patient3@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Suresh Raina", "preferred_language": "en", "account_type": "Member", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "patient3@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa03"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa04', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'patient4@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Priya Dharshini", "preferred_language": "ta", "account_type": "Member", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "patient4@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa04"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa05', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'patient5@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Karthik Raja", "preferred_language": "en", "account_type": "Member", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "patient5@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa05"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa06', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'patient6@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Anitha Radhakrishnan", "preferred_language": "ta", "account_type": "Member", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "patient6@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa06"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa07', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'patient7@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Balaji Swaminathan", "preferred_language": "en", "account_type": "Member", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "patient7@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa07"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa08', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'patient8@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Meenakshi Sundaram", "preferred_language": "ta", "account_type": "Member", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "patient8@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa08"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa09', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'patient9@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Master Rahul", "preferred_language": "en", "account_type": "Member", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "patient9@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa09"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa10', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'patient10@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Baby Shalini", "preferred_language": "ta", "account_type": "Member", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "patient10@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa10"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  -- Staff, Clinicians, Management, Doctors
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa11', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'doctor.karthik@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Dr. Karthik", "preferred_language": "en", "account_type": "Professional", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "doctor.karthik@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa11"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa12', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'nurse.lakshmi@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Nurse Lakshmi", "preferred_language": "ta", "account_type": "Staff", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "nurse.lakshmi@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa12"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa13', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'admin.srinivasan@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Admin Srinivasan", "preferred_language": "en", "account_type": "Administrator", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "admin.srinivasan@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa13"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa14', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'manager.meena@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Manager Meena", "preferred_language": "en", "account_type": "Management", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "manager.meena@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa14"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '901fbc4e-289c-461d-a0a1-7c98e219aa15', '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 
    'counselor.anand@youmecareall.com', (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(), now(), now(), now(), '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Counselor Anand", "preferred_language": "ta", "account_type": "Professional", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "counselor.anand@youmecareall.com", "email_verified": true, "sub": "901fbc4e-289c-461d-a0a1-7c98e219aa15"}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  )
ON CONFLICT (id) DO NOTHING;

-- 2. Link identities for each of the accounts
INSERT INTO auth.identities (
  id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
)
VALUES
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa01', '901fbc4e-289c-461d-a0a1-7c98e219aa01', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa01", "email": "patient1@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa02', '901fbc4e-289c-461d-a0a1-7c98e219aa02', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa02", "email": "patient2@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa03', '901fbc4e-289c-461d-a0a1-7c98e219aa03', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa03", "email": "patient3@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa04', '901fbc4e-289c-461d-a0a1-7c98e219aa04', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa04", "email": "patient4@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa05', '901fbc4e-289c-461d-a0a1-7c98e219aa05', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa05", "email": "patient5@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa06', '901fbc4e-289c-461d-a0a1-7c98e219aa06', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa06", "email": "patient6@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa07', '901fbc4e-289c-461d-a0a1-7c98e219aa07', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa07", "email": "patient7@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa08', '901fbc4e-289c-461d-a0a1-7c98e219aa08', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa08", "email": "patient8@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa09', '901fbc4e-289c-461d-a0a1-7c98e219aa09', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa09", "email": "patient9@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa10', '901fbc4e-289c-461d-a0a1-7c98e219aa10', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa10", "email": "patient10@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa11', '901fbc4e-289c-461d-a0a1-7c98e219aa11', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa11", "email": "doctor.karthik@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa12', '901fbc4e-289c-461d-a0a1-7c98e219aa12', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa12", "email": "nurse.lakshmi@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa13', '901fbc4e-289c-461d-a0a1-7c98e219aa13', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa13", "email": "admin.srinivasan@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa14', '901fbc4e-289c-461d-a0a1-7c98e219aa14', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa14", "email": "manager.meena@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now()),
  (gen_random_uuid(), '901fbc4e-289c-461d-a0a1-7c98e219aa15', '901fbc4e-289c-461d-a0a1-7c98e219aa15', 'email', '{"sub": "901fbc4e-289c-461d-a0a1-7c98e219aa15", "email": "counselor.anand@youmecareall.com", "email_verified": true}'::jsonb, now(), now(), now())
ON CONFLICT (provider_id, provider) DO NOTHING;
