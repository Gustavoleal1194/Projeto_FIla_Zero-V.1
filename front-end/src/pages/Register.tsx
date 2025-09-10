import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { RegisterRequest } from '../types';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<RegisterRequest>();

    const password = watch('senha');

    const onSubmit = async (data: RegisterRequest) => {
        try {
            await registerUser(data);
            toast.success('Conta criada com sucesso!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao criar conta');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">FZ</span>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Crie sua conta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ou{' '}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            entre na sua conta existente
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nome" className="label">
                                Nome completo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('nome', {
                                        required: 'Nome é obrigatório',
                                        minLength: {
                                            value: 2,
                                            message: 'Nome deve ter pelo menos 2 caracteres'
                                        }
                                    })}
                                    type="text"
                                    className="input pl-10"
                                    placeholder="Seu nome completo"
                                />
                            </div>
                            {errors.nome && (
                                <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="label">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('email', {
                                        required: 'Email é obrigatório',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email inválido'
                                        }
                                    })}
                                    type="email"
                                    className="input pl-10"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="telefone" className="label">
                                Telefone (opcional)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('telefone')}
                                    type="tel"
                                    className="input pl-10"
                                    placeholder="(11) 99999-9999"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="senha" className="label">
                                Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('senha', {
                                        required: 'Senha é obrigatória',
                                        minLength: {
                                            value: 6,
                                            message: 'Senha deve ter pelo menos 6 caracteres'
                                        }
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    className="input pl-10 pr-10"
                                    placeholder="Sua senha"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.senha && (
                                <p className="mt-1 text-sm text-red-600">{errors.senha.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmarSenha" className="label">
                                Confirmar senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('confirmarSenha', {
                                        required: 'Confirmação de senha é obrigatória',
                                        validate: value => value === password || 'Senhas não coincidem'
                                    })}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="input pl-10 pr-10"
                                    placeholder="Confirme sua senha"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmarSenha && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmarSenha.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                            Eu aceito os{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-500">
                                termos de uso
                            </a>{' '}
                            e{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-500">
                                política de privacidade
                            </a>
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
