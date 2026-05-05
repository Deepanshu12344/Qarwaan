export default function CTASection() {
  return (
    <section id="cta" className="py-20 md:py-[100px]" style={{ backgroundColor: '#f4efe7' }}>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-4 text-center text-black">
        <p className="q-kicker text-black/70">Final Call</p>
        <h2 className="mt-4 text-4xl font-semibold">So, Ready To Start?</h2>
        <div className="mt-8">
          <a href="/enquire" className="q-button">
            Start Your Journey
          </a>
        </div>
      </div>
    </section>
  );
}
