// frontend/src/pages/RegisterPage.jsx
import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { registerSchema } from '../validations/schemas';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PasswordStrengthMeter from '../components/common/PasswordStrengthMeter';
import GoogleLoginButton from '../components/common/GoogleLoginButton';

// --- Redux Imports ---
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser, clearError, googleLoginHandler } from '../redux/features/authSlice';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, error, isAuthenticated, user } = useSelector(state => state.auth);
    const loading = status === 'loading';

    // Vite env vars: import.meta.env
    const isMockAuth = (import.meta.env.VITE_AUTH_MODE || 'mock').toLowerCase() !== 'api';

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.type === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [isAuthenticated, navigate, user]);

    useEffect(() => {
        dispatch(clearError());
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await dispatch(registerUser({
                fullName: values.fullName,
                email: values.email,
                password: values.password
            })).unwrap();

            // auto-login after register
            await dispatch(loginUser({ email: values.email, password: values.password })).unwrap();

        } catch (e) {
            console.error('Registration or auto-login failed:', e);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAlertClose = () => {
        dispatch(clearError());
    };

    return (
        <>
            <Navbar />

            <Container className="py-5" style={{ minHeight: 'calc(100vh - 120px)' }}>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="auth-card shadow-lg border-0">
                            <Card.Body className="p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold">Create Your Account</h2>
                                    <p className="text-muted">Join StockWise Trading today</p>
                                </div>

                                {error && (
                                    <Alert variant="danger" dismissible onClose={handleAlertClose} className="d-flex align-items-center">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {error}
                                    </Alert>
                                )}

                                {isMockAuth && (
                                    <Alert variant="info" className="small">
                                        <strong>Demo mode:</strong> backend API is off. You can register a new account, or use the demo login:
                                        <div className="mt-2">
                                            <code>nidhi@example.com</code> / <code>Nidhi@1234</code>
                                        </div>
                                    </Alert>
                                )}

                                <Formik
                                    initialValues={{
                                        fullName: 'Nidhi',
                                        email: 'nidhi@example.com',
                                        password: 'Nidhi@1234',
                                        confirmPassword: 'Nidhi@1234',
                                        terms: false
                                    }}
                                    validationSchema={registerSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit: formikSubmit,
                                        isSubmitting,
                                    }) => {
                                        const handleInputChange = (e) => {
                                            handleChange(e);
                                            if (error) dispatch(clearError());
                                        };

                                        return (
                                            <Form noValidate onSubmit={formikSubmit}>
                                                <Form.Group className="mb-3 position-relative" controlId="regFullName">
                                                    <Form.Label>Full Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="fullName"
                                                        placeholder="Enter your full name"
                                                        value={values.fullName}
                                                        onChange={handleInputChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.fullName && !!errors.fullName}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.fullName}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-3 position-relative" controlId="regEmail">
                                                    <Form.Label>Email address</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        placeholder="name@example.com"
                                                        value={values.email}
                                                        onChange={handleInputChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.email && !!errors.email}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.email}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-3 position-relative" controlId="regPassword">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="password"
                                                        placeholder="Create a password"
                                                        value={values.password}
                                                        onChange={handleInputChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.password && !!errors.password}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.password}
                                                    </Form.Control.Feedback>
                                                    <PasswordStrengthMeter password={values.password} />
                                                    <Form.Text className="text-muted d-block mt-1">
                                                        Min 8 chars, incl. uppercase, lowercase, number, symbol.
                                                    </Form.Text>
                                                </Form.Group>

                                                <Form.Group className="mb-3 position-relative" controlId="regConfirmPassword">
                                                    <Form.Label>Confirm Password</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="confirmPassword"
                                                        placeholder="Confirm your password"
                                                        value={values.confirmPassword}
                                                        onChange={handleInputChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.confirmPassword}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-4" controlId="regTerms">
                                                    <Form.Check
                                                        type="checkbox"
                                                        name="terms"
                                                        checked={values.terms}
                                                        onChange={handleInputChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.terms && !!errors.terms}
                                                        feedback={errors.terms}
                                                        feedbackType="invalid"
                                                        label={
                                                            <span className="small">
                                                                I agree to the{' '}
                                                                <Link to="/terms" target="_blank" className="text-decoration-none">
                                                                    Terms of Service
                                                                </Link>{' '}
                                                                and{' '}
                                                                <Link to="/privacy" target="_blank" className="text-decoration-none">
                                                                    Privacy Policy
                                                                </Link>
                                                            </span>
                                                        }
                                                    />
                                                </Form.Group>

                                                <div className="d-grid gap-2">
                                                    <Button
                                                        variant="primary"
                                                        type="submit"
                                                        disabled={loading || isSubmitting}
                                                        size="lg"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <Spinner animation="border" size="sm" className="me-2" />
                                                                Creating Account...
                                                            </>
                                                        ) : (
                                                            'Create Account'
                                                        )}
                                                    </Button>
                                                </div>
                                            </Form>
                                        );
                                    }}
                                </Formik>

                                <div className="auth-divider my-4">
                                    <span>OR</span>
                                </div>

                                <div className="d-grid gap-2 mb-4">
                                    {!isMockAuth && (
                                        <GoogleLoginButton isRegistration={true} />
                                    )}
                                </div>

                                <div className="text-center">
                                    <p className="mb-0 text-muted">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-decoration-none fw-medium">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </>
    );
};

export default RegisterPage;
