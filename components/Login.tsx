import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, User, Lock, Mail, ArrowLeft, Building } from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';

interface LoginPageProps {
  onGoBack: () => void;
  onLoginSuccess: () => void;
}

export function LoginPage({ onGoBack, onLoginSuccess }: LoginPageProps) {
  const { login, register, error: authError, clearError, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '', // ✅ ADD THIS
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'vendor',
    vendorInfo: {
      businessName: '',
      businessAddress: '',
      phone: '',
      description: ''
    }
  });

  // Clear errors when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setError('');
    setSuccess('');
    clearError();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    clearError();

    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const success = await login(loginForm.email, loginForm.password);
      console.log("Login function called");
      if (success) {
        setSuccess('Login successful!');
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      } else {
        setError(authError || 'Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    clearError();

    // Validation
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (registerForm.role === 'vendor' && !registerForm.vendorInfo.businessName) {
      setError('Business name is required for vendor registration');
      return;
    }

    try {
      const userData = {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone,
        role: registerForm.role,
        ...(registerForm.role === 'vendor' && {
          vendorInfo: registerForm.vendorInfo
        })
      };

      console.log("Sending Data:", userData);

      const success = await register(userData);
      if (success) {
        setSuccess('Registration successful!');
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      } else {
        setError(authError || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  // Fixed handleInputChange function
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('vendorInfo.')) {
      const vendorField = name.split('.')[1];
      setRegisterForm(prev => ({
        ...prev,
        vendorInfo: {
          ...prev.vendorInfo,
          [vendorField]: value
        }
      }));
    } else {
      setRegisterForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">


        <Card className="shadow-xl border-0">
          <CardHeader className="text-center bg-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Sattvik Kaleva</CardTitle>
            <p className="text-orange-100">Pure Vegetarian Restaurant</p>
          </CardHeader>

          <CardContent className="p-6">
            {(error || authError) && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error || authError}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={handleLoginInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={handleLoginInputChange}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="reg-name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reg-name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={registerForm.name}
                        onChange={handleRegisterInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reg-email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reg-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerForm.email}
                        onChange={handleRegisterInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>


                  {/* Phone */}
                  <div>
                    <Label htmlFor="reg-phone">Phone *</Label>
                    <Input
                      id="reg-phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={registerForm.phone}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </div>

                  {/* Role Selection */}
                  <div>
                    <Label className="text-base mb-3 block">Register As</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={registerForm.role === 'user' ? 'default' : 'outline'}
                        onClick={() => setRegisterForm(prev => ({ ...prev, role: 'user' }))}
                        className={`h-12 ${registerForm.role === 'user' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200 text-orange-700 hover:bg-orange-50'}`}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Customer
                      </Button>
                      <Button
                        type="button"
                        variant={registerForm.role === 'vendor' ? 'default' : 'outline'}
                        onClick={() => setRegisterForm(prev => ({ ...prev, role: 'vendor' }))}
                        className={`h-12 ${registerForm.role === 'vendor' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200 text-orange-700 hover:bg-orange-50'}`}
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Vendor
                      </Button>
                    </div>
                  </div>

                  {/* Vendor Information */}
                  {registerForm.role === 'vendor' && (
                    <div className="space-y-4 p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <h4 className="font-medium text-orange-800">Vendor Information</h4>

                      <div>
                        <Label htmlFor="business-name">Business Name *</Label>
                        <Input
                          id="business-name"
                          name="vendorInfo.businessName"
                          type="text"
                          placeholder="Your business name"
                          value={registerForm.vendorInfo.businessName}
                          onChange={handleRegisterInputChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="business-address">Business Address</Label>
                        <Input
                          id="business-address"
                          name="vendorInfo.businessAddress"
                          type="text"
                          placeholder="Business address"
                          value={registerForm.vendorInfo.businessAddress}
                          onChange={handleRegisterInputChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="business-phone">Phone</Label>
                        <Input
                          id="business-phone"
                          name="vendorInfo.phone"
                          type="tel"
                          placeholder="Business phone number"
                          value={registerForm.vendorInfo.phone}
                          onChange={handleRegisterInputChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="business-description">Description</Label>
                        <textarea
                          id="business-description"
                          name="vendorInfo.description"
                          placeholder="Brief description of your business"
                          value={registerForm.vendorInfo.description}
                          onChange={handleRegisterInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="reg-password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reg-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min. 6 characters)"
                        value={registerForm.password}
                        onChange={handleRegisterInputChange}
                        className="pl-10 pr-10"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-6 text-sm text-gray-600">
              <p>🌱 100% Pure Vegetarian Restaurant</p>
              <p>Traditional • Authentic • Delicious</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}