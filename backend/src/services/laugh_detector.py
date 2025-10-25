import cv2
import mediapipe as mp
import numpy as np
from mediapipe import solutions
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

BaseOptions = python.BaseOptions
VisionRunningMode = vision.RunningMode
FaceLandmarker = vision.FaceLandmarker
FaceLandmarkerOptions = vision.FaceLandmarkerOptions

class LaughterFeatureDetector:
    def __init__(self, model_path: str):
        """
        Initialize the FaceLandmarker with blendshape output.
        """
        self.options = FaceLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=model_path),
            running_mode=VisionRunningMode.IMAGE,
            output_face_blendshapes=True,
            num_faces=1
        )
        self.landmarker = vision.FaceLandmarker.create_from_options(self.options)

    def detect_features(self, image_input):
        """
        Detect selected blendshape features in an image.
        
        Args:
            image_input: Either a string (file path) or a numpy array in RGB format
        """
        if isinstance(image_input, str):
            # Load image from file
            image_bgr = cv2.imread(image_input)
            if image_bgr is None:
                raise FileNotFoundError(f"Cannot load image {image_input}")
            image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
        else:
            # Use provided numpy array (assuming it's already in RGB format)
            image_rgb = image_input

        # Create a mediapipe Image with explicit image_format when passing raw data
        # (the landmarker expects an Image object when providing `data`).
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)
        result = self.landmarker.detect(mp_image)

        # Build a dict of blendshape_name -> score (category_name uses lowercase keys)
        if not result.face_blendshapes:
            # print("No face/blendshapes detected.")
            return {}

        blend_dict = {b.category_name: b.score for b in result.face_blendshapes[0]}
        # print("Detected blendshape features:")
        # Print a few useful values (use actual category names returned by the model)
        interesting = [
            'mouthSmileLeft', 'mouthSmileRight',
             'mouthUpperUpLeft', 'mouthUpperUpRight'
        ] # 'jawOpen', 'cheekSquintLeft', 'cheekSquintRight'

        # Simple heuristic to decide if the person is laughing:
        # - smiling (left or right) is the strongest cue
        # - jawOpen (mouth opening) is supportive
        smile = max(blend_dict.get('mouthSmileLeft', 0.0), blend_dict.get('mouthSmileRight', 0.0))
        # jaw = blend_dict.get('jawOpen', 0.0)
        # cheek = max(blend_dict.get('cheekSquintLeft', 0.0), blend_dict.get('cheekSquintRight', 0.0))
        mouth_open = max(blend_dict.get('mouthUpperUpLeft', 0.0), blend_dict.get('mouthUpperUpRight', 0.0))
        # Combine into a single score (weights are tunable)
        laugh_score = 0.4 * smile + 0.6 * mouth_open

        return {
            'is_laughing': laugh_score >= 0.5
        }

    def close(self):
        """Clean up resources."""
        self.landmarker.close()
