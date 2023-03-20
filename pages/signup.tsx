import Head from 'next/head';

import { CenteredBoxForm } from '@/components/CenteredBoxForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { AppWithAuth } from '@/components/AppWithAuth';

function SignupPage() {
  return (
    <>
      <Head>
        <title>Signup Page</title>
      </Head>

      <AppWithAuth>
        <CenteredBoxForm>
          <SignUpForm />
        </CenteredBoxForm>
      </AppWithAuth>
    </>
  );
}

export default SignupPage;
