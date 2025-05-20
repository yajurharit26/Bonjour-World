import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Globe.css";

const Globe = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(new THREE.Color(0, 0, 0, 0), 0);

    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("./Earth.jpeg", () => {
      const geometry = new THREE.SphereGeometry(6, 64, 64);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 10,
      });
      const globe = new THREE.Mesh(geometry, material);
      scene.add(globe);

      globe.position.set(0, 0, 0);

      camera.position.z = 15;
      camera.position.y = 5;
      camera.lookAt(globe.position);

      const ambientLight = new THREE.AmbientLight(0xffffff, 5);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      const animate = () => {
        requestAnimationFrame(animate);

        globe.rotation.y += 0.005;

        renderer.render(scene, camera);
      };

      animate();
    });

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="globe-container"></div>;
};

export default Globe;
