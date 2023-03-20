import React from 'react';
import Head from 'next/head';

import { CenteredBoxForm } from '@/components/CenteredBoxForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { AppWithAuth } from '@/components/AppWithAuth';

function LoginPage() {
  return (
    <>
      <Head>
        <title>LoginPage</title>
      </Head>

      <AppWithAuth>
        <CenteredBoxForm>
          <LoginForm />
        </CenteredBoxForm>
      </AppWithAuth>
    </>
  );
}

export default LoginPage;
