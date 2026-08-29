export default function Banner() {
  return (
    <div className="mt-3">
      <img
        src="/src/assets/mediacenter/Banner/download.jpg"
        className="img-fluid w-100"
        style={{ height: "250px", objectFit: "cover", borderRadius: "10px" }}
        alt="Banner"
      />
    </div>
  );
}