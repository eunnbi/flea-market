import React, { useEffect } from 'react';
import Script from 'next/script';

interface Props {
  location: string;
  setLocationErrorInfo: (isError: boolean) => void;
}

function Map({ location, setLocationErrorInfo }: Props) {
  const onLoadKakaoMap = () => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) return;
    if (location === '') {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
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
    } else {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(location, function (result: any, status: any) {
        // 정상적으로 검색이 완료됐으면
        if (status === window.kakao.maps.services.Status.OK) {
          const container = document.getElementById('map');
          const options = {
            center: new window.kakao.maps.LatLng(result[0].y, result[0].x),
            level: 3,
          };
          const map = new window.kakao.maps.Map(container, options);
          const markerPosition = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);
          setLocationErrorInfo(false);
        } else {
          setLocationErrorInfo(true);
        }
      });
    }
  };

  useEffect(() => {
    onLoadKakaoMap();
  }, [location]);

  return (
    <>
      <Script
        src={`http://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&autoload=false&libraries=services`}
        type="text/javascript"
        onLoad={() => window.kakao.maps.load(onLoadKakaoMap)}
      />
      <div id="map" />
    </>
  );
}

export default React.memo(Map);
