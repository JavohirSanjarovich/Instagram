import React, { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}
function Map() {
  useEffect(() => {
    if (navigator.geolocation) {
      console.log('aa')
      navigator.geolocation.getCurrentPosition(function (position) {
        const container = document.getElementById('myMap');
        const options = {
          center: new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude),  
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);  
        
        let markerPosition = new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude)
        
        let marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        
        marker.setMap(map);
      }, function (error) {
        console.error(error);
      }, {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: Infinity
      });
    } else {
      alert('Doesnt support GPS');
      return;
    }

  }, []);
  return (
    <div id='myMap' style={{
      width: '570px',
      height: '250px'
    }}></div>
  );
}

export default Map