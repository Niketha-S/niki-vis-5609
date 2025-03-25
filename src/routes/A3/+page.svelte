<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { FontLoader, Font } from "three/addons/loaders/FontLoader.js";
    import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
    import * as d3 from "d3";
    import { addGround, onWindowResize, loadModels } from "$lib/Helper-3D";

    let container: HTMLElement;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    const FLOOR = -250;

    const morphs: Array<THREE.Mesh> = [];
    let mixer: THREE.AnimationMixer;

    const clock = new THREE.Clock();

    // Extend THREE.Mesh to include the speed property
    class MovingMesh extends THREE.Mesh {
        speed: number;

        constructor(geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[]) {
            super(geometry, material);
            this.speed = 0;
        }
    }

    onMount(async () => {
        const movies = await loadMovieData();
        console.log("Loaded movie data - ", movies);
        if (movies && movies.length > 0) {
            init(window.innerWidth, window.innerHeight, movies);
        } else {
            console.error("No valid movie data available.");
        }
    });

    async function loadMovieData() {
        try {
            console.log("Loading movie data...");

            // Load the Complete Dataset 
            const data = await d3.csv("./summer_movies.csv");
            console.log("Raw CSV Data:", data);

            // Parse the data to extract primary_title and genres
            const parsedData = data
                .map((movie) => ({
                    primary_title: movie.primary_title,
                    genres: movie.genres ? movie.genres.split(",").map((genre) => genre.trim()) : [],
                }))
                .filter((movie) => movie.primary_title && movie.genres.length > 0);
            console.log("Parsed and filtered data:", parsedData);

            // Calculate genre counts
            const genreCount = parsedData.reduce((acc, movie) => {
                movie.genres.forEach((genre) => {
                    if (acc[genre]) {
                        acc[genre] += 1;
                    } else {
                        acc[genre] = 1;
                    }
                });
                return acc;
            }, {});
            console.log("Genre count:", genreCount);

            // Convert genre counts into an array of objects with genre and number_of_movies
            const genreCountArray = Object.keys(genreCount).map((genre) => ({
                genre: genre,
                number_of_movies: genreCount[genre],
            }));
            console.log("Genre Count Array:", genreCountArray);

            return genreCountArray;
        } catch (error) {
            console.error("Error loading movie data:", error);
            return [];
        }
    }

    function init(SCREEN_WIDTH: number, SCREEN_HEIGHT: number, movies: any[]) {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        container.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(23, SCREEN_WIDTH / SCREEN_HEIGHT, 10, 3000);
        camera.position.set(0, 100, 2500);

        scene = new THREE.Scene();
        new THREE.TextureLoader().load("3d/sky.jpg", (texture) => {
            texture.repeat.set(0.8, 1);
            scene.background = texture;
        });

        const ambient = new THREE.AmbientLight(0xffffff);
        scene.add(ambient);

        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(0, 1500, 1000);
        light.castShadow = true;
        Object.assign(light.shadow.camera, {
            top: 2000,
            bottom: -2000,
            left: -2000,
            right: 2000,
            near: 1200,
            far: 2500,
        });
        light.shadow.bias = 0.0001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 1024;
        scene.add(light);

        addGround(scene, FLOOR, "3d/grasslight-big.jpg");

        const fontLoader = new FontLoader();
        fontLoader.load("3d/helvetiker_bold.typeface.json", (font: Font) => {
            const textGeo = new TextGeometry("Summer Movies-Niketha", {
                font: font,
                size: 40,
                depth: 15,
            });
            textGeo.computeBoundingBox();
            const centerOffset = -0.5 * (textGeo!.boundingBox!.max.x - textGeo!.boundingBox!.min.x);
            const textMaterial = new THREE.MeshStandardMaterial({ color: 0x449900 });
            const titleMesh = new THREE.Mesh(textGeo, textMaterial);
            titleMesh.position.x = centerOffset;
            titleMesh.position.y = FLOOR + 700;
            titleMesh.castShadow = true;
            scene.add(titleMesh);

            createBars(scene, font, movies);
        });

        const models = [
            {
                path: "3d/Horse.glb",
                speed: 300,
                duration: 1,
                x: 100,
                y: FLOOR,
                z: 300,
                scale: 0.5,
            },
            {
                path: "3d/Horse.glb",
                speed: 300,
                duration: 1,
                x: 100,
                y: FLOOR,
                z: 450,
                scale: 0.5,
            },
            {
                path: "3d/Flamingo.glb",
                speed: 350,
                duration: 1,
                x: 300,
                y: FLOOR + 550,
                z: 100,
                scale: 0.5,
            },
            {
                path: "3d/Flamingo.glb",
                speed: 350,
                duration: 1,
                x: 300 ,
                y: FLOOR + 550,
                z: 200,
                scale: 0.5,
            },
            {
                path: "3d/Parrot.glb",
                speed: 350,
                duration: 0.5,
                x: 500 ,
                y: FLOOR + 500,
                z: 700,
                scale: 0.5,
            },
        ];
        mixer = loadModels(models, scene, mixer, morphs);

        window.addEventListener("resize", () =>
            onWindowResize(camera, renderer, window.innerWidth, window.innerHeight)
        );

        renderer.setAnimationLoop(animate);
    }

        
    function createBars(scene: THREE.Scene, font: Font, movies: any[]) {
        const maxHeight = 400;
        const barMaxWidth = 1000;

        const xScale = d3
            .scaleBand()
            .domain(movies.map((movie) => movie.genre))
            .range([-barMaxWidth / 2, barMaxWidth / 2])
            .padding(0.9);

        const yScale = d3
            .scaleLinear()
            .domain([0, Math.max(...movies.map((movie) => movie.number_of_movies))])
            .range([0, maxHeight]);

        movies.forEach((movie) => {
            const bar = createOneBar(yScale(movie.number_of_movies), xScale.bandwidth());
            bar.position.set(xScale(movie.genre), FLOOR + (yScale(movie.number_of_movies) / 2 )+ 15 , 0);
            scene.add(bar);

            addLabelToBar(
                scene,
                `${movie.genre}: ${movie.number_of_movies}`,
                xScale(movie.genre) - xScale.bandwidth() / 2,
                FLOOR + 10,
                bar.position.z + xScale.bandwidth() + 20 ,
                font,

            
            );
        });
    }

    function createOneBar(height: number, width: number) {
        const cylinderRadius = width * 2.5; // Increase cylinder breadth (2.5x)
        const geometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, height * 2.0, 32); 
        const material = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load("./3d/wood-texture.jpg") });
        const bar = new THREE.Mesh(geometry, material);
        bar.castShadow = true;
        bar.receiveShadow = true;
        return bar;
}


    function addLabelToBar(scene: THREE.Scene, text: string, x: number, y: number, z: number, font: Font) {
        const textGeometry = new TextGeometry(text, { font: font, size: 4, depth: 2 });
        const textMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(x, y, z);
        textMesh.castShadow = true;
        textMesh.receiveShadow = false;
        textMesh.rotation.y=Math.PI*2;
        textMesh.position.y -= 6; // Moves it further down

        scene.add(textMesh);
    }



    function animate() {
        const delta = clock.getDelta();
        mixer.update(delta);
 


        morphs.forEach((morph) => {
            const movingMesh = morph as MovingMesh;  // Type assertion to ensure it's a MovingMesh
            if (typeof movingMesh.speed === "number") {
    movingMesh.position.x += (movingMesh.speed || 0) * delta;
}
            if (movingMesh.position.x > window.innerWidth / 2) {
                movingMesh.position.x = -window.innerWidth / 2 - Math.random() * 200;
            }
        });

        renderer.render(scene, camera);
    }
</script>

<div bind:this={container} class="container"></div>

<style>
    div.container {
        width: 100%;
        height: 100%;
    }

    

</style>