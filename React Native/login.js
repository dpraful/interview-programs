import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const API_URL = 'https://your-api.com';

export default function login() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Email validation
  const validateEmail = email => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Login API
  const loginUser = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('Login response:', data);

      Alert.alert('Success', 'Login successful');

      // Example:
      // navigation.replace('Home');
      
    } catch (error) {
      console.log('Login error:', error);

      Alert.alert(
        'Login Failed',
        error.message || 'Something went wrong',
      );
    }
  };

  // Register API
  const registerUser = async () => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log('Register response:', data);

      Alert.alert(
        'Success',
        'Registration successful. Please login.',
      );

      // Switch to login
      setIsLogin(true);

      setName('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});

    } catch (error) {
      console.log('Register error:', error);

      Alert.alert(
        'Registration Failed',
        error.message || 'Something went wrong',
      );
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await loginUser();
      } else {
        await registerUser();
      }
    } finally {
      setLoading(false);
    }
  };

  // Switch Login/Register
  const switchMode = () => {
    setIsLogin(!isLogin);

    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">

        <View style={styles.card}>

          {/* Title */}
          <Text style={styles.title}>
            {isLogin ? 'Welcome Back 👋' : 'Create Account 🚀'}
          </Text>

          <Text style={styles.subtitle}>
            {isLogin
              ? 'Login to continue'
              : 'Register to get started'}
          </Text>

          {/* Name */}
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>

              <TextInput
                style={[
                  styles.input,
                  errors.name && styles.inputError,
                ]}
                placeholder="Enter your name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={text => {
                  setName(text);
                  setErrors({...errors, name: ''});
                }}
              />

              {errors.name && (
                <Text style={styles.errorText}>
                  {errors.name}
                </Text>
              )}
            </View>
          )}

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>

            <TextInput
              style={[
                styles.input,
                errors.email && styles.inputError,
              ]}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={text => {
                setEmail(text);
                setErrors({...errors, email: ''});
              }}
            />

            {errors.email && (
              <Text style={styles.errorText}>
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>

            <View
              style={[
                styles.passwordContainer,
                errors.password && styles.inputError,
              ]}>

              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setErrors({...errors, password: ''});
                }}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>

            </View>

            {errors.password && (
              <Text style={styles.errorText}>
                {errors.password}
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>

              <View
                style={[
                  styles.passwordContainer,
                  errors.confirmPassword && styles.inputError,
                ]}>

                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={text => {
                    setConfirmPassword(text);
                    setErrors({
                      ...errors,
                      confirmPassword: '',
                    });
                  }}
                />

                <TouchableOpacity
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }>
                  <Text style={styles.showText}>
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>

              </View>

              {errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
          )}

          {/* Forgot Password */}
          {isLogin && (
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => Alert.alert('Forgot Password')}>
              <Text style={styles.forgotText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            disabled={loading}
            onPress={handleSubmit}>

            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'LOGIN' : 'REGISTER'}
              </Text>
            )}

          </TouchableOpacity>

          {/* Switch */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account?"
                : 'Already have an account?'}
            </Text>

            <TouchableOpacity onPress={switchMode}>
              <Text style={styles.switchButton}>
                {isLogin ? ' Register' : ' Login'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
  },

  subtitle: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 7,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#222',
  },

  passwordContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 12,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },

  showText: {
    color: '#2563eb',
    fontWeight: '600',
  },

  inputError: {
    borderColor: '#ef4444',
  },

  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 5,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },

  forgotText: {
    color: '#2563eb',
    fontWeight: '600',
  },

  button: {
    height: 52,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  switchText: {
    color: '#777',
    fontSize: 14,
  },

  switchButton: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 14,
  },
});