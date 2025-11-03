import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export interface DemoUser {
  email: string;
  password: string;
  roles: {
    sales?: boolean;
    finance?: boolean;
    admin?: boolean;
  };
  displayName: string;
}

export const demoUsers: DemoUser[] = [
  {
    email: 'admin@erp.com',
    password: 'admin123',
    roles: { admin: true, sales: true, finance: true },
    displayName: 'Admin User',
  },
  {
    email: 'sales@erp.com',
    password: 'sales123',
    roles: { sales: true },
    displayName: 'Sales User',
  },
  {
    email: 'finance@erp.com',
    password: 'finance123',
    roles: { finance: true },
    displayName: 'Finance User',
  },
];

export async function seedDemoUsers() {
  console.log('👥 Creating demo users...');

  for (const user of demoUsers) {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: user.email,
        roles: user.roles,
        displayName: user.displayName,
        createdAt: new Date(),
      });

      console.log(`✅ Created user: ${user.email}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  User already exists: ${user.email}`);
      } else {
        console.error(`❌ Error creating user ${user.email}:`, error);
      }
    }
  }

  console.log('🎉 Demo users seed completed!');
}
