import { useAuth } from "../../context/AuthContext";

function WelcomeBanner({ name }) {
  const { user } = useAuth();
  const displayName = name || user?.username || (user?.email ? user.email.split("@")[0] : "Investor");

  return (
    <section className="mb-8">
      <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
        Welcome back, {displayName} 👋
      </h1>
      <p className="mt-1 text-stone-500 text-sm">
        Here is a real-time overview of your finances and piggy-bank progress today.
      </p>
    </section>
  );
}

export default WelcomeBanner;