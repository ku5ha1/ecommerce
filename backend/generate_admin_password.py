#!/usr/bin/env python3
"""
Script to generate a hashed password for creating admin accounts in pgAdmin
"""

from passlib.context import CryptContext

# Use the same password context as the main app
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain_password: str) -> str:
    """Hash a plain password using bcrypt"""
    return pwd_context.hash(plain_password)

if __name__ == "__main__":
    print("=== Admin Password Generator ===")
    print("This script generates a hashed password for creating admin accounts in pgAdmin")
    print()
    
    # You can change this password
    admin_password = "admin123"  # Change this to your desired password
    
    hashed_password = hash_password(admin_password)
    
    print(f"Plain password: {admin_password}")
    print(f"Hashed password: {hashed_password}")
    print()
    print("=== SQL INSERT Statement ===")
    print("Use this SQL in pgAdmin to create an admin user:")
    print()
    print(f"""INSERT INTO "user" (username, email, hashed_password, is_admin) 
VALUES ('admin', 'admin@example.com', '{hashed_password}', true);""")
    print()
    print("=== Alternative: Update existing user to admin ===")
    print("If you want to make an existing user an admin:")
    print()
    print(f"""UPDATE "user" 
SET hashed_password = '{hashed_password}', is_admin = true 
WHERE username = 'your_username';""") 