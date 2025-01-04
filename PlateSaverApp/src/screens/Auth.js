import React, { useEffect, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Text, View, Button, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { SignedIn, SignedOut, useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { SignOutButton } from '@clerk/clerk-expo/web';

const useWarmUpBrowser = () => {
  useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Auth() {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive && setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, [startOAuthFlow]);

  return (
    <SafeAreaView>
      <Link href="/">
      <SignedIn>
        <Text>Hyyy</Text>
       
        </SignedIn>
      </Link>
      <SignedOut>
      <Button title="Sign in with Google" onPress={onPress} />
      </SignedOut>
    </SafeAreaView>
  );
}
