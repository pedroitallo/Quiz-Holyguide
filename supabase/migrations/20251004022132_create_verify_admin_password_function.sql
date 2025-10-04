/*
  # Create Password Verification Function

  Creates a PostgreSQL function to verify admin passwords using bcrypt.

  ## Function: verify_admin_password

  ### Parameters
  - user_email (text) - Admin email address
  - user_password (text) - Password to verify

  ### Returns
  - boolean - true if password matches, false otherwise

  ### Security
  - Uses crypt function to compare password hashes
  - Returns only boolean result, never exposes password data
*/

-- Create function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(
  user_email text,
  user_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT password_hash INTO stored_hash
  FROM admin_users
  WHERE email = user_email AND is_active = true;
  
  IF stored_hash IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN (stored_hash = crypt(user_password, stored_hash));
END;
$$;
