import { useEffect, useState } from 'react';

interface Props {
  location: string;
  setLocationErrorInfo: (isError: boolean) => void;
}

function Map({ location, setLocationErrorInfo }: Props) {
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const { latitude, longitude } = position;
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) =>
      setPosition({
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
    );
  }, []);

  useEffect(() => {
    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        if (latitude === 0 || longitude === 0) return;
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    };

    mapScript.addEventListener('load', onLoadKakaoMap);
    return () => mapScript.removeEventListener('load', onLoadKakaoMap);
  }, [latitude, longitude]);

  useEffect(() => {
    if (location === '') return;
    console.log(location);
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(location, function (result: any, status: any) {
      // 정상적으로 검색이 완료됐으면
      if (status === window.kakao.maps.services.Status.OK) {
        setPosition({
          latitude: result[0].y,
          longitude: result[0].x,
        });
        setLocationErrorInfo(false);
      } else {
        setLocationErrorInfo(true);
      }
    });
  }, [location]);

  return <div id="map" />;
}

export default Map;
