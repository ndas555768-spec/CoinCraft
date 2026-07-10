function SectionHeading({
    title,
    subtitle,
}) {
    return (
        <div className="mb-12 text-center">

            <h2 className="text-4xl font-bold mb-4">
                {title}
            </h2>

            <p className="text-stone-600 max-w-2xl mx-auto">
                {subtitle}
            </p>

        </div>
    );
}

export default SectionHeading;