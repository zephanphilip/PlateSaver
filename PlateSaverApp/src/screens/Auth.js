// import React, { useEffect, useCallback } from 'react';
// import * as WebBrowser from 'expo-web-browser';
// import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
// import { Link } from 'expo-router';
// import { SignedIn, SignedOut, useOAuth } from '@clerk/clerk-expo';
// import * as Linking from 'expo-linking';

// const useWarmUpBrowser = () => {
//   useEffect(() => {
//     WebBrowser.warmUpAsync();
//     return () => {
//       WebBrowser.coolDownAsync();
//     };
//   }, []);
// };

// WebBrowser.maybeCompleteAuthSession();

// export default function Auth() {
//   useWarmUpBrowser();

//   const googleOAuth = useOAuth({ strategy: 'oauth_google' });
//   const appleOAuth = useOAuth({ strategy: 'oauth_apple' });
//   const facebookOAuth = useOAuth({ strategy: 'oauth_facebook' });

//   const handleOAuth = useCallback(async (oauthProvider) => {
//     try {
//       const { startOAuthFlow } = oauthProvider;
//       const { createdSessionId, setActive } = await startOAuthFlow({
//         redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
//       });

//       if (createdSessionId) {
//         setActive && setActive({ session: createdSessionId });
//       }
//     } catch (err) {
//       console.error(JSON.stringify(err, null, 2));
//     }
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Link href="/">
//         <SignedIn>
//           <Text style={styles.welcomeText}>Welcome Back!</Text>
//         </SignedIn>
//       </Link>
//       <SignedOut>
//       <Text style={styles.welcomeText}>You are just one click away! </Text>
//         <View style={styles.authButtonsContainer}>
//           <TouchableOpacity
//             style={[styles.authButton, styles.googleButton]}
//             onPress={() => handleOAuth(googleOAuth)}
//           >
//             <Text style={styles.authButtonText}>Sign in with Google</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.authButton, styles.appleButton]}
//             onPress={() => handleOAuth(appleOAuth)}
//           >
//             <Text style={styles.authButtonText}>Sign in with Apple</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.authButton, styles.facebookButton]}
//             onPress={() => handleOAuth(facebookOAuth)}
//           >
//             <Text style={styles.authButtonText}>Sign in with Facebook</Text>
//           </TouchableOpacity>
//         </View>
//       </SignedOut>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f7f7f7',
//     padding: 20,
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//   },
//   authButtonsContainer: {
//     width: '100%',
//     alignItems: 'center',
//   },
//   authButton: {
//     width: '80%',
//     paddingVertical: 12,
//     borderRadius: 25,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   googleButton: {
//     backgroundColor: '#4285F4',
//   },
//   appleButton: {
//     backgroundColor: '#000',
//   },
//   facebookButton: {
//     backgroundColor: '#4267B2',
//   },
//   authButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
import React, { useEffect, useCallback, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import { SignedIn, SignedOut, useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const useWarmUpBrowser = () => {
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Auth() {
  useWarmUpBrowser();
  const [loading, setLoading] = useState('');
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  const googleOAuth = useOAuth({ strategy: 'oauth_google' });
  const appleOAuth = useOAuth({ strategy: 'oauth_apple' });
  const facebookOAuth = useOAuth({ strategy: 'oauth_facebook' });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleOAuth = useCallback(async (oauthProvider, providerName) => {
    try {
      setLoading(providerName);
      const { startOAuthFlow } = oauthProvider;
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        setActive && setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading('');
    }
  }, []);

  const AuthButton = ({ onPress, icon, color, text, provider }) => (
    <TouchableOpacity
      style={[styles.authButton, { backgroundColor: color }]}
      onPress={onPress}
      disabled={loading !== ''}
    >
      <View style={styles.buttonContent}>
        <MaterialCommunityIcons 
          name={icon} 
          size={24} 
          color="white" 
        />
        <Text style={styles.authButtonText}>
          {loading === provider ? 'Connecting...' : text}
        </Text>
        {loading === provider && (
          <MaterialCommunityIcons 
            name="loading" 
            size={24} 
            color="white" 
            style={styles.loadingIcon} 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Link href="/">
        <SignedIn>
          <Animated.View style={[styles.welcomeContainer, { opacity: fadeAnim }]}>
            <MaterialCommunityIcons name="check-circle" size={60} color="#4CAF50" />
            <Text style={styles.welcomeText}>Welcome Back!</Text>
          </Animated.View>
        </SignedIn>
      </Link>
      
      <SignedOut>
        <Animated.View 
          style={[
            styles.authContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerContainer}>
            <MaterialCommunityIcons name="login" size={40} color="#333" />
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.subtitleText}>You are just one click away!</Text>
          </View>

          <View style={styles.authButtonsContainer}>
            <AuthButton
              onPress={() => handleOAuth(googleOAuth, 'google')}
              icon="google"
              color="#4285F4"
              text="Continue with Google"
              provider="google"
            />
            {Platform.OS === 'ios' && (
              <AuthButton
                onPress={() => handleOAuth(appleOAuth, 'apple')}
                icon="apple"
                color="#000"
                text="Continue with Apple"
                provider="apple"
              />
            )}
            <AuthButton
              onPress={() => handleOAuth(facebookOAuth, 'facebook')}
              icon="facebook"
              color="#4267B2"
              text="Continue with Facebook"
              provider="facebook"
            />
          </View>
        </Animated.View>
      </SignedOut>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  authContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  authButtonsContainer: {
    gap: 16,
  },
  authButton: {
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingIcon: {
    position: 'absolute',
    right: 16,
  },
});
