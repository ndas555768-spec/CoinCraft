import { useForm } from "react-hook-form";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
function Login() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await login(data);

            // Save JWT tokens
            localStorage.setItem("access", response.access);
            localStorage.setItem("refresh", response.refresh);

            alert("Login Successful!");

            navigate("/dashboard");
            console.log(response);
        } catch (error) {
            console.error(error);

            alert("Invalid Email or Password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-6">
                    CoinCraft Login
                </h1>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >

                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", { required: true })}
                        className="w-full border p-3 rounded-lg"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", { required: true })}
                        className="w-full border p-3 rounded-lg"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Login;