import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styles from "../Css/Detail.module.css";
import darkLogo from "../Logo/darkLogo.png";

export default function Detail() {
  const [location, setLocation] = useState();
  const [keyword, setKeyword] = useState();
  const [detail, setDetail] = useState([]);
  const navigate = useNavigate();

  const { state } = useLocation();
  async function textSearch() {
    const { Place } = await window.google.maps.importLibrary("places");

    const txtRequest = {
      textQuery: `${location} ${keyword} `,
      fields: ["displayName", "location", "rating", "photos", "reviews"],
      includedType: "restaurant",
      isOpenNow: true,
      language: "kr",
      maxResultCount: 7,
      region: "kr",
      useStrictTypeFiltering: false,
    };

    const { places } = await Place.searchByText(txtRequest);
    const obj = places.map((place) => {
      return place.id;
    });
    await obj.map(async (each) => {
      const place = new Place({
        id: each,
      });
      await place.fetchFields({
        fields: [
          "displayName",
          "photos",
          "editorialSummary",
          "reviews",
          "rating",
        ],
      });
      let rating = place.rating;
      let displayName = place.displayName;
      let url;
      let review;
      if (place.photos[0]) {
        url = place.photos[0].getURI();
      }
      if (place.reviews) {
        review = place.reviews.map((each) => {
          return { content: each.Kg, rating: each.Ig };
        });
      }
      setDetail((prev) => [...prev, { url, displayName, rating, review }]);
    });
  }

  useEffect(() => {
    if (location && keyword) {
      textSearch();
    }
  }, [location, keyword]);

  useEffect(() => {
    setLocation(state.location);
    setKeyword(state.keyword);
  }, [state]);

  return (
    <div className={styles.body}>
      <nav className={styles.upBar} id={styles.hd}>
        <img
          onClick={() => {
            navigate("/");
          }}
          src={darkLogo}
        />
      </nav>
      <div className={styles.container}>
        {detail.length > 0
          ? detail.map((detail, i) => {
              return (
                <div key={i} className={styles.detail}>
                  <img
                    src={detail.url}
                    alt="Restaurant"
                    className={styles.detailImage}
                  />

                  <div className={styles.detailText}>
                    <p>
                      {detail.displayName} : {detail.rating}
                    </p>
                  </div>

                  <div className={styles.reviewSection}>
                    {detail.review.map((review, idx) => (
                      <div key={idx} className={styles.review}>
                        <p>
                          <strong>Rating:</strong> {review.rating}
                        </p>
                        <p>{review.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          : " "}
      </div>
    </div>
  );
}
