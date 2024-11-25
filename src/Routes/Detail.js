import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Detail() {
  const [location, setLocation] = useState();
  const [keyword, setKeyword] = useState();
  const [imgUrl, setImgurl] = useState();

  const { state } = useLocation();
  async function textSearch() {
    const { Place, Photo } = await window.google.maps.importLibrary('places');

    const txtRequest = {
      textQuery: `${location} ${keyword} `,
      fields: ['displayName', 'location', 'businessStatus', 'rating', 'photos'],
      includedType: 'restaurant',
      isOpenNow: true,
      language: 'kr',
      maxResultCount: 7,
      region: 'kr',
      useStrictTypeFiltering: false,
    };

    const { places } = await Place.searchByText(txtRequest);
    console.log(Photo.getURI(places[0].Eg.photos[0]));
    setImgurl(places[0].Eg);
  }

  useEffect(() => {
    if (location && keyword) {
      console.log(`${location} ${keyword}`);
      textSearch();
    }
  }, [location, keyword]);

  useEffect(() => {
    setLocation(state.location);
    setKeyword(state.keyword);
  }, [state]);

  return (
    <div
      style={{
        width: '80%',
        height: '100vh',
        border: '1px solid blue',
        margin: '0 auto',
      }}
    >
      <div>
        <img src={imgUrl}></img>
      </div>
    </div>
  );
}
