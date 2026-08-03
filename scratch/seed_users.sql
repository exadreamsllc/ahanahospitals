-- 1. Insert users into auth.users
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, 
  last_sign_in_at, created_at, updated_at, 
  raw_app_meta_data, raw_user_meta_data, is_super_admin, is_anonymous, is_sso_user, 
  deleted_at, confirmation_token, email_change, email_change_confirm_status, 
  email_change_token_current, email_change_token_new, phone_change, phone_change_token, 
  reauthentication_token, recovery_token
)
VALUES
  (
    'd03bb23a-3078-4bc3-a307-f77a7ed8a53c',
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    'patient@youmecareall.com',
    (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Sample Patient", "preferred_language": "en", "account_type": "Member", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "patient@youmecareall.com", "email_verified": true, "sub": "d03bb23a-3078-4bc3-a307-f77a7ed8a53c", "phone_verified": false}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    '25708a43-570b-467a-8640-2ce3677a66fc',
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    'provider@youmecareall.com',
    (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Sample Provider", "preferred_language": "en", "account_type": "Professional", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "provider@youmecareall.com", "email_verified": true, "sub": "25708a43-570b-467a-8640-2ce3677a66fc", "phone_verified": false}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    'cbab6a4c-7ac7-4aa7-b000-53b41b9fb96e',
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    'staff@youmecareall.com',
    (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Sample Staff", "preferred_language": "en", "account_type": "Staff", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "staff@youmecareall.com", "email_verified": true, "sub": "cbab6a4c-7ac7-4aa7-b000-53b41b9fb96e", "phone_verified": false}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    'c80886df-777e-497f-a885-8ba7fd9e25a3',
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    'management@youmecareall.com',
    (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Sample Management", "preferred_language": "en", "account_type": "Management", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "management@youmecareall.com", "email_verified": true, "sub": "c80886df-777e-497f-a885-8ba7fd9e25a3", "phone_verified": false}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  ),
  (
    'e7b5c672-eb82-49d6-9412-3bdd1ff7b014',
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    'admin@youmecareall.com',
    (SELECT encrypted_password FROM auth.users WHERE email = 'exadreamsllc@gmail.com'),
    now(),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Sample Admin", "preferred_language": "en", "account_type": "Administrator", "tenant_id": "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", "email": "admin@youmecareall.com", "email_verified": true, "sub": "e7b5c672-eb82-49d6-9412-3bdd1ff7b014", "phone_verified": false}'::jsonb,
    null, false, false, null, '', '', 0, '', '', '', '', '', ''
  )
ON CONFLICT (id) DO NOTHING;

-- 2. Insert identities into auth.identities
INSERT INTO auth.identities (
  id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
)
VALUES
  (
    gen_random_uuid(),
    'd03bb23a-3078-4bc3-a307-f77a7ed8a53c',
    'd03bb23a-3078-4bc3-a307-f77a7ed8a53c',
    'email',
    '{"sub": "d03bb23a-3078-4bc3-a307-f77a7ed8a53c", "email": "patient@youmecareall.com", "email_verified": true}'::jsonb,
    now(),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    '25708a43-570b-467a-8640-2ce3677a66fc',
    '25708a43-570b-467a-8640-2ce3677a66fc',
    'email',
    '{"sub": "25708a43-570b-467a-8640-2ce3677a66fc", "email": "provider@youmecareall.com", "email_verified": true}'::jsonb,
    now(),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'cbab6a4c-7ac7-4aa7-b000-53b41b9fb96e',
    'cbab6a4c-7ac7-4aa7-b000-53b41b9fb96e',
    'email',
    '{"sub": "cbab6a4c-7ac7-4aa7-b000-53b41b9fb96e", "email": "staff@youmecareall.com", "email_verified": true}'::jsonb,
    now(),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'c80886df-777e-497f-a885-8ba7fd9e25a3',
    'c80886df-777e-497f-a885-8ba7fd9e25a3',
    'email',
    '{"sub": "c80886df-777e-497f-a885-8ba7fd9e25a3", "email": "management@youmecareall.com", "email_verified": true}'::jsonb,
    now(),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'e7b5c672-eb82-49d6-9412-3bdd1ff7b014',
    'e7b5c672-eb82-49d6-9412-3bdd1ff7b014',
    'email',
    '{"sub": "e7b5c672-eb82-49d6-9412-3bdd1ff7b014", "email": "admin@youmecareall.com", "email_verified": true}'::jsonb,
    now(),
    now(),
    now()
  )
ON CONFLICT (provider_id, provider) DO NOTHING;
