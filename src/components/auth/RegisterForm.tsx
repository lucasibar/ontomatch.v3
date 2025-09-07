'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signUp, clearError } from '@/store/sliceAuth/authSlice';
import { Mail, User, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText } from '@/shared/utils/passwordValidation';

interface PasswordRequirement {
  text: string;
  met: boolean;
}

export default function RegisterForm() {
  // Estado del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  
  const [uiState, setUiState] = useState({
    showPassword: false,
    showConfirmPassword: false,
    showPasswordRequirements: false
  });
  
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''));
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  // Limpiar errores al montar el componente
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Validar contraseña en tiempo real
  useEffect(() => {
    if (formData.password) {
      setPasswordValidation(validatePassword(formData.password));
    }
  }, [formData.password]);

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const togglePasswordVisibility = (field: 'showPassword' | 'showConfirmPassword') => () => {
    setUiState(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    try {
      await dispatch(signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      })).unwrap();
      
      router.push('/login/confirm-email');
    } catch (error) {
      // El error se maneja en el slice
    }
  };

  const isFormValid = (): boolean => {
    return passwordValidation.isValid && formData.password === formData.confirmPassword;
  };

  const getRequirementIcon = (isMet: boolean) => {
    return isMet ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-400" />
    );
  };

  const passwordRequirements: PasswordRequirement[] = [
    { text: 'Al menos 8 caracteres', met: formData.password.length >= 8 },
    { text: 'Al menos un número', met: /\d/.test(formData.password) },
    { text: 'Al menos un símbolo', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) },
    { text: 'Al menos una mayúscula', met: /[A-Z]/.test(formData.password) },
    { text: 'Al menos una minúscula', met: /[a-z]/.test(formData.password) }
  ];

  const getInputClassName = (isValid: boolean, hasValue: boolean) => {
    const baseClasses = "appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 sm:text-sm";
    
    if (!hasValue) return `${baseClasses} border-gray-300 focus:ring-violet-500`;
    return isValid 
      ? `${baseClasses} border-green-300 focus:ring-green-500`
      : `${baseClasses} border-red-300 focus:ring-red-500`;
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Campo Nombre Completo */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Nombre Completo
          </label>
          <div className="mt-1 relative">
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={formData.fullName}
              onChange={handleInputChange('fullName')}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
              placeholder="Tu nombre completo"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Campo Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1 relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange('email')}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
              placeholder="tu@email.com"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Campo Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type={uiState.showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleInputChange('password')}
              onFocus={() => setUiState(prev => ({ ...prev, showPasswordRequirements: true }))}
              onBlur={() => setTimeout(() => setUiState(prev => ({ ...prev, showPasswordRequirements: false })), 200)}
              className={getInputClassName(passwordValidation.isValid, !!formData.password)}
              placeholder="••••••••"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={togglePasswordVisibility('showPassword')}
                className="text-gray-400 hover:text-gray-600"
              >
                {uiState.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {/* Indicador de fortaleza */}
          {formData.password && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xs text-gray-500">Fortaleza:</span>
              <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordValidation.strength)}`}>
                {getPasswordStrengthText(passwordValidation.strength)}
              </span>
            </div>
          )}

          {/* Requisitos de contraseña */}
          {uiState.showPasswordRequirements && formData.password && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Requisitos de contraseña:</p>
              <div className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {getRequirementIcon(req.met)}
                    <span className={`text-xs ${req.met ? 'text-gray-600' : 'text-gray-500'}`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Campo Confirmar Contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <div className="mt-1 relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={uiState.showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              className={getInputClassName(formData.password === formData.confirmPassword, !!formData.confirmPassword)}
              placeholder="••••••••"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={togglePasswordVisibility('showConfirmPassword')}
                className="text-gray-400 hover:text-gray-600"
              >
                {uiState.showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {/* Indicador de coincidencia */}
          {formData.confirmPassword && (
            <div className="mt-2 flex items-center space-x-2">
              {formData.password === formData.confirmPassword ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">Las contraseñas coinciden</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-600">Las contraseñas no coinciden</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading || !isFormValid()}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </div>

      <div className="text-center text-sm text-gray-600">
        Al crear una cuenta, aceptas nuestros términos y condiciones
      </div>
    </form>
  );
}
