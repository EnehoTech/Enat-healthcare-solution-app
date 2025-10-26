const SectionTitle = ({title, description}) => {
  return (
    <>
      <section className="section-title">
        <h2>{title}</h2>
        <p>{description}</p>
      </section>
    </>
  );
}

export default SectionTitle