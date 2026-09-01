# Project File and Function Documentation

## [img2threejs\forge\next.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/next.py)

**Details:** Source code file.

**Functions / Classes:**
- `emit_local_state`
- `main`

---

## [img2threejs\forge\report.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/report.py)

**Details:** Source code file.

**Functions / Classes:**
- `main`

---

## [img2threejs\forge\state.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/state.py)

**Details:** Source code file.

**Functions / Classes:**
- `build_parser`
- `main`
- `print_status`

---

## [img2threejs\forge\materials\compatibility.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/materials/compatibility.py)

**Details:** Source code file.

**Functions / Classes:**
- `check_compatibility`
- `main`

---

## [img2threejs\forge\materials\reference.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/materials/reference.py)

**Details:** Source code file.

**Functions / Classes:**
- `MaterialReferenceError`
- `_candidate`
- `_material_index`
- `_prior_values`
- `_token`
- `_tokens`
- `build_assignment`
- `load_reference`
- `resolve_material`
- `validate_reference`

---

## [img2threejs\forge\materials\__init__.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/materials/__init__.py)

**Details:** Source code file.

*No functions detected.*

---

## [img2threejs\forge\stage1_intake\analyze_texture.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/analyze_texture.py)

**Details:** Source code file.

**Functions / Classes:**
- `_lum`
- `_sample`
- `analyze`
- `apply_to_material`
- `main`

---

## [img2threejs\forge\stage1_intake\bind_detail_properties.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/bind_detail_properties.py)

**Details:** Source code file.

**Functions / Classes:**
- `bind`
- `main`

---

## [img2threejs\forge\stage1_intake\build_detail_inventory.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/build_detail_inventory.py)

**Details:** Source code file.

**Functions / Classes:**
- `build_inventory`
- `build_zones`
- `chunk`
- `composite_over_white`
- `load_image`
- `main`
- `make_detail_stub`
- `paeth_predictor`
- `parse_components`
- `read_png`
- `write_png_rgb`

---

## [img2threejs\forge\stage1_intake\camera_fitting_math.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/camera_fitting_math.py)

**Details:** Source code file.

**Functions / Classes:**
- `has_degenerate_world_geometry`
- `project_landmark`
- `residual_components`
- `rms_reprojection_error`

---

## [img2threejs\forge\stage1_intake\camera_fitting_solver.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/camera_fitting_solver.py)

**Details:** Source code file.

**Functions / Classes:**
- `_central_difference_jacobian`
- `_normal_equations`
- `_parameter_vector`
- `_parameters_from_vector`
- `_scaled_step_is_small`
- `_solve_linear_system`
- `_vector_with_addition`
- `_vector_with_delta`
- `fit_parameters`

---

## [img2threejs\forge\stage1_intake\camera_fitting_types.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/camera_fitting_types.py)

**Details:** Source code file.

**Functions / Classes:**
- `AspectDescriptor`
- `CameraFitDescriptor`
- `CameraInitialization`
- `CameraParameters`
- `ConvergenceDiagnostic`
- `DegenerateCorrespondencesError`
- `FitCameraParameters`
- `FitDiagnostic`
- `FitState`
- `FovField`
- `InsufficientCorrespondencesError`
- `InvalidCameraDimensionsError`
- `InvalidInitialCameraError`
- `LandmarkCorrespondence`
- `NonFiniteCameraInputError`
- `NormalizedCorrespondence`
- `NormalizedFitInput`
- `OrientationDescriptor`
- `PositionDescriptor`
- `ResidualDiagnostic`
- `ScalarField`
- `SolverLimits`
- `__str__`
- `_finite_scalar`
- `_is_numeric_sequence`
- `_is_positive_dimension`
- `_normalize_correspondence`
- `_normalize_initial_camera`
- `_point2`
- `_point3`
- `fov_degrees`
- `image_height`
- `image_width`
- `name`
- `normalize_fit_input`
- `observed`
- `pitch_degrees`
- `position`
- `roll_degrees`
- `world`
- `yaw_degrees`

---

## [img2threejs\forge\stage1_intake\camera_image_helpers.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/camera_image_helpers.py)

**Details:** Source code file.

**Functions / Classes:**
- `bmp_size`
- `build_camera`
- `clamp`
- `detect_size`
- `estimate_fov`
- `gif_size`
- `jpeg_size`
- `png_size`
- `webp_size`

---

## [img2threejs\forge\stage1_intake\check_intake_correctness.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/check_intake_correctness.py)

**Details:** Source code file.

**Functions / Classes:**
- `decide`
- `expose_assumptions`
- `main`

---

## [img2threejs\forge\stage1_intake\check_reference_admission.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/check_reference_admission.py)

**Details:** Source code file.

**Functions / Classes:**
- `check_admission`
- `largest_component_fraction`
- `main`

---

## [img2threejs\forge\stage1_intake\cs2_foundation.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/cs2_foundation.py)

**Details:** Source code file.

**Functions / Classes:**
- `adapt_texture_result`
- `classify_map_path`
- `enrich_manifest_with_metadata`
- `map_assets_to_reference_pbr`
- `normalize_cs2_metadata`
- `resolve_identity`
- `validate_route_requirements`

---

## [img2threejs\forge\stage1_intake\cs2_manifest.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/cs2_manifest.py)

**Details:** Source code file.

**Functions / Classes:**
- `_classification_error`
- `_heuristic_signal`
- `build_classification_record`
- `build_manifest`
- `main`
- `persist_manifest`
- `validate_manifest`

---

## [img2threejs\forge\stage1_intake\cs2_review_contract.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/cs2_review_contract.py)

**Details:** Source code file.

**Functions / Classes:**
- `build_review_scene`
- `validate_review_scene`

---

## [img2threejs\forge\stage1_intake\delight_albedo.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/delight_albedo.py)

**Details:** Source code file.

**Functions / Classes:**
- `blur_scalar`
- `chunk`
- `clamp`
- `clamp01`
- `delight`
- `estimate_confidence`
- `load_image`
- `main`
- `paeth_predictor`
- `percentile`
- `read_png`
- `srgb_luma`
- `write_png_rgba`

---

## [img2threejs\forge\stage1_intake\detect_cs2.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/detect_cs2.py)

**Details:** Source code file.

**Functions / Classes:**
- `_aspect_in_cs2_ranges`
- `_color_energy`
- `_gif_dimensions`
- `_jpeg_dimensions`
- `_png_dimensions`
- `_read_dimensions`
- `_webp_dimensions`
- `detect_cs2_signals`
- `main`

---

## [img2threejs\forge\stage1_intake\detect_reference_effects.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/detect_reference_effects.py)

**Details:** Source code file.

**Functions / Classes:**
- `_grid_step`
- `_luma_grid`
- `_mask_grid`
- `detect_background_blur`
- `detect_highlight_glow`
- `local_gradient_energy`
- `luma`
- `main`
- `recommend_effects`

---

## [img2threejs\forge\stage1_intake\extract_cs2_textures.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/extract_cs2_textures.py)

**Details:** Source code file.

**Functions / Classes:**
- `build_asset_records`
- `classify_extracted_maps`
- `extract`
- `main`
- `run_source2viewer`
- `source2viewer_available`

---

## [img2threejs\forge\stage1_intake\extract_gradient_stops.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/extract_gradient_stops.py)

**Details:** Source code file.

**Functions / Classes:**
- `_median`
- `extract_gradient_stops`
- `hue_name`
- `main`
- `sample_banded_stops`

---

## [img2threejs\forge\stage1_intake\extract_hair_evidence.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/extract_hair_evidence.py)

**Details:** Source code file.

**Functions / Classes:**
- `_bbox`
- `_luma`
- `analyse_view`
- `extract_hair_evidence`
- `main`
- `otsu_threshold`

---

## [img2threejs\forge\stage1_intake\extract_landmarks.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/extract_landmarks.py)

**Details:** Source code file.

**Functions / Classes:**
- `build_overlay`
- `chunk`
- `composite_over_white`
- `draw_glyph`
- `draw_hline`
- `draw_text`
- `draw_vline`
- `load_image`
- `main`
- `make_anatomy_skeleton`
- `paeth_predictor`
- `read_png`
- `set_pixel`
- `write_png_rgb`

---

## [img2threejs\forge\stage1_intake\extract_part_color_recipe.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/extract_part_color_recipe.py)

**Details:** Source code file.

**Functions / Classes:**
- `_is_monotonic`
- `_lab_f`
- `_lab_f_inv`
- `_linear_to_srgb`
- `_matmul3`
- `_sample_axis`
- `_srgb_to_linear`
- `bradford_adapt`
- `build_recipe`
- `classify_material`
- `detect_color_gradient`
- `estimate_roughness_from_hotspot`
- `lab_distance`
- `lab_kmeans_palette`
- `lab_to_rgb`
- `lab_to_rgba`
- `lab_to_xyz`
- `main`
- `rgb_to_xyz`
- `srgb_to_lab`
- `xyz_to_lab`
- `xyz_to_rgb`

---

## [img2threejs\forge\stage1_intake\extract_pbr_evidence.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/extract_pbr_evidence.py)

**Details:** Source code file.

**Functions / Classes:**
- `blur_scalar`
- `build_foreground_mask`
- `chunk`
- `clamp`
- `clamp01`
- `color_distance`
- `estimate_confidence`
- `extract`
- `hex_to_rgb`
- `kmeans_palette`
- `load_image`
- `main`
- `make_maps`
- `map_url`
- `mask_bbox`
- `material_patch`
- `median_color`
- `merge_material_patch`
- `paeth_predictor`
- `percentile`
- `read_png`
- `representative_samples`
- `resample_crop`
- `rgb_to_hex`
- `sample_corner_background`
- `saturation`
- `slugify`
- `srgb_luma`
- `surface_bands_from_stats`
- `write_png_rgb`

---

## [img2threejs\forge\stage1_intake\fetch_cs2_metadata.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/fetch_cs2_metadata.py)

**Details:** Source code file.

**Functions / Classes:**
- `_rarity_name`
- `_weapon_name`
- `load_index`
- `main`
- `match_records`
- `to_metadata`

---

## [img2threejs\forge\stage1_intake\label_glb_nodes.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/label_glb_nodes.py)

**Details:** Source code file.

**Functions / Classes:**
- `_apply`
- `_classify`
- `_collect`
- `_compose`
- `_identity`
- `_mesh_local_bounds`
- `_multiply`
- `_read_gltf_json`
- `_world_bounds`
- `label`
- `main`

---

## [img2threejs\forge\stage1_intake\locate_cs2_vpk.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/locate_cs2_vpk.py)

**Details:** Source code file.

**Functions / Classes:**
- `default_steam_roots`
- `locate_vpk`
- `main`

---

## [img2threejs\forge\stage1_intake\material_region_analysis.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/material_region_analysis.py)

**Details:** Source code file.

**Functions / Classes:**
- `_bounded_bbox`
- `_observations`
- `analyze_manifest`
- `crop_region`
- `main`

---

## [img2threejs\forge\stage1_intake\probe_glb.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/probe_glb.py)

**Details:** Source code file.

**Functions / Classes:**
- `_accessor_bounds`
- `_buffer_view_bytes`
- `_chunk_type_name`
- `_merge_bounds`
- `main`
- `parse_glb`
- `probe_glb`
- `sha256`

---

## [img2threejs\forge\stage1_intake\probe_image.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/probe_image.py)

**Details:** Source code file.

**Functions / Classes:**
- `bmp_size`
- `detect_image_type`
- `detect_size`
- `gif_size`
- `jpeg_size`
- `main`
- `png_size`
- `probe`
- `tiff_size`
- `webp_size`

---

## [img2threejs\forge\stage1_intake\run_vision_adapter.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/run_vision_adapter.py)

**Details:** Source code file.

**Functions / Classes:**
- `build_command`
- `main`
- `resolve_python`

---

## [img2threejs\forge\stage1_intake\search_specs.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/search_specs.py)

**Details:** Source code file.

**Functions / Classes:**
- `CliArgumentError`
- `CliFailure`
- `CliNamespace`
- `CliOptions`
- `ErrorContext`
- `OutputIndex`
- `SuccessPayload`
- `__init__`
- `_emit_error`
- `_index_payload`
- `_parse_options`
- `_print_human`
- `_print_json`
- `main`

---

## [img2threejs\forge\stage1_intake\semantic_decomposition.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/semantic_decomposition.py)

**Details:** Source code file.

**Functions / Classes:**
- `assess_semantic_decomposition`

---

## [img2threejs\forge\stage1_intake\solve_camera_pose.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage1_intake/solve_camera_pose.py)

**Details:** Source code file.

**Functions / Classes:**
- `_camera_parameters_payload`
- `_fitted_scalar`
- `_invalid_initial_camera_error`
- `_residual_diagnostics`
- `_solver_limits`
- `fit_camera_to_correspondences`
- `main`

---

## [img2threejs\forge\stage2_spec\apply_material_analysis.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage2_spec/apply_material_analysis.py)

**Details:** Source code file.

**Functions / Classes:**
- `_layer`
- `apply_material_analysis`
- `main`

---

## [img2threejs\forge\stage2_spec\cs2_adapters.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage2_spec/cs2_adapters.py)

**Details:** Source code file.

**Functions / Classes:**
- `FamilyAdapter`
- `component_tree_contract`
- `get_family_adapter`

---

## [img2threejs\forge\stage2_spec\derive_geometry.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage2_spec/derive_geometry.py)

**Details:** Source code file.

**Functions / Classes:**
- `_col_span`
- `_row_span`
- `derive_from_image`
- `derive_lathe_profile`
- `main`

---

## [img2threejs\forge\stage2_spec\hair_profile.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage2_spec/hair_profile.py)

**Details:** Source code file.

**Functions / Classes:**
- `_is_number`
- `_unit`
- `_validate_flow_field`
- `_validate_hairline`
- `_validate_mass`
- `hair_profile_report`
- `validate_hair_profile`

---

## [img2threejs\forge\stage2_spec\humanoid_proportions.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage2_spec/humanoid_proportions.py)

**Details:** Source code file.

**Functions / Classes:**
- `apply_to_spec`
- `derive_anatomy`
- `in_heads`
- `main`
- `missing_for_heads`
- `nearest_supported_heads`

---

## [img2threejs\forge\stage2_spec\new_pre_spec_assessment.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage2_spec/new_pre_spec_assessment.py)

**Details:** Source code file.

**Functions / Classes:**
- `LocalSpecSearchIndex`
- `LocalSpecSearchPayload`
- `PreSpecPayload`
- `PreSpecPayloadRequired`
- `detect_cs2_intent`
- `main`
- `make_payload`
- `search_local_specs`
- `select_spec_collection`

---

## [img2threejs\forge\stage2_spec\new_sculpt_spec.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage2_spec/new_sculpt_spec.py)

**Details:** Source code file.

**Functions / Classes:**
- `_cnode`
- `_cs2_finish_material`
- `_cs2_hidden_material`
- `_cs2_pattern_affine`
- `_cs2_substrate_material`
- `_cs2_wear_mask`
- `_cs2node`
- `_eye_socket_sdf`
- `_hu_ratio`
- `_limb_attachment`
- `_rel`
- `_rig_chain_of`
- `_shade_hex`
- `apply_character_pose`
- `apply_character_template`
- `apply_cs2_manifest_evidence`
- `apply_cs2_template`
- `bone_parent`
- `derive_character_rig`
- `explicit_tip`
- `infer_finish_style_from_skin_name`
- `inject_geometry_rules`
- `is_bone`
- `joint_of`
- `load_assessment`
- `main`
- `make_character_build_passes`
- `make_character_component_tree`
- `make_character_feature_targets`
- `make_cs2_component_tree`
- `make_cs2_feature_targets`
- `make_pre_spec_assessment`
- `make_quality_contract`
- `make_spec`
- `model_pos`
- `resolve_cs2_finish_style`
- `segment`
- `slugify`

---

## [img2threejs\forge\stage2_spec\validate_sculpt_spec.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage2_spec/validate_sculpt_spec.py)

**Details:** Source code file.

**Functions / Classes:**
- `_bbox_diagonal`
- `_detail_link_keys`
- `_has_gloss_response`
- `_has_repetition_or_small_parts`
- `_mirror_partner`
- `_normalize_identity_field`
- `as_number_list`
- `attachment_emits_cylinder`
- `attachment_is_complete`
- `completed_passes_from_history`
- `component_is_recessed_feature`
- `component_recessed_feature_matches`
- `component_requires_attachment`
- `component_role_tokens`
- `direction`
- `emitted_subdivision_primitive`
- `flatness_risk`
- `has_attachment_number`
- `has_non_empty_detail`
- `is_number`
- `is_rgba_string`
- `is_textureless`
- `joint`
- `layer_number`
- `length`
- `load_spec`
- `main`
- `reference_pbr_usable`
- `requires_topology_classification`
- `review_completes_pass`
- `schema_version_tuple`
- `taper_risk`
- `tip`
- `validate_action_profile`
- `validate_action_readiness`
- `validate_attachment`
- `validate_bool_object`
- `validate_build_passes`
- `validate_character_track`
- `validate_chirality`
- `validate_color_material_recipe`
- `validate_components`
- `validate_cs2_contract`
- `validate_cs2_view_dependent_environment`
- `validate_detail_inventory`
- `validate_dimensions`
- `validate_evidence`
- `validate_feature_review_targets`
- `validate_feature_reviews`
- `validate_geometry_descriptor`
- `validate_look_dev_targets`
- `validate_material_pipeline_contract`
- `validate_material_scalar_or_layer`
- `validate_materials`
- `validate_nonnegative_int`
- `validate_open_shell_topology`
- `validate_pipeline_routing_contract`
- `validate_pre_spec_assessment`
- `validate_quality_contract`
- `validate_quality_depth`
- `validate_quality_targets`
- `validate_recessed_feature_topology`
- `validate_reference_pbr`
- `validate_reference_pbr_map`
- `validate_review_history`
- `validate_rig_admission`
- `validate_score_block`
- `validate_sculpt_pipeline`
- `validate_self_correct_loop`
- `validate_spec`
- `validate_stand_proud`
- `validate_string_array`
- `validate_subdivision_budget`
- `validate_terminology_profile`
- `validate_textureless`
- `validate_unit_interval`
- `validate_visual_evidence_history`
- `validate_visual_evidence_item`
- `world_x`

---

## [img2threejs\forge\stage3_build\bake_projected_texture.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage3_build/bake_projected_texture.py)

**Details:** Source code file.

**Functions / Classes:**
- `build_descriptor`
- `clamp01`
- `load_camera`
- `main`

---

## [img2threejs\forge\stage3_build\decimate.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage3_build/decimate.py)

**Details:** Source code file.

**Functions / Classes:**
- `_add`
- `_error`
- `_plane`
- `_quadric`
- `_triangles`
- `build_lod_plan`
- `cost`
- `decimate`
- `main`

---

## [img2threejs\forge\stage3_build\generate_threejs_factory.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage3_build/generate_threejs_factory.py)

**Details:** Source code file.

**Functions / Classes:**
- `GeometryNotImplementedError`
- `_calls_geometry_for`
- `_posed_bone_rotations`
- `_rig_pose_lines`
- `_rig_weight_function_lines`
- `assert_pass_unlocked`
- `blocked_report`
- `bone_var`
- `capped_sdf`
- `completed_passes`
- `component_refs_for_pass`
- `component_uses_dense_height_maps`
- `const_name`
- `decimate_ratio`
- `emit_blocked`
- `emit_rig_hierarchy`
- `filter_components_for_pass`
- `generate`
- `geometry_for`
- `hex_to_number`
- `include_component`
- `json_literal`
- `load_spec`
- `local_var`
- `main`
- `material_base_value`
- `pascal_case`
- `pass_order`
- `review_completes_pass`
- `review_visual_evidence`
- `rig_is_bone_track`
- `root_tip_gradient`
- `scale_triple`
- `scale_vector`
- `stand_proud_ring_stack`
- `strict_quality_failures`
- `subdivision_iterations`
- `unlocked_pass`
- `vector`
- `vertex_paint`
- `visit`

---

## [img2threejs\forge\stage3_build\module_cache.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage3_build/module_cache.py)

**Details:** Source code file.

**Functions / Classes:**
- `_dependents_of`
- `canonical_module_hash`
- `get_module`
- `invalidate_attached`
- `main`
- `module_cache_key`
- `put_module`

---

## [img2threejs\forge\stage3_build\morph_targets.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage3_build/morph_targets.py)

**Details:** Source code file.

**Functions / Classes:**
- `_format_summary`
- `build_morph_set`
- `corrective_from_bend`
- `main`
- `make_morph_target`

---

## [img2threejs\forge\stage3_build\orchestrate_passes.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage3_build/orchestrate_passes.py)

**Details:** Source code file.

**Functions / Classes:**
- `attachment_complete`
- `attachment_gaps`
- `check_pass`
- `completed_passes`
- `component_requires_attachment`
- `current_pass`
- `has_non_empty`
- `has_number`
- `has_passing_tier1_result`
- `is_vector3`
- `ledger_disagreements`
- `lighting_pass_gaps`
- `load_spec`
- `main`
- `material_has_locality`
- `material_has_palette`
- `material_has_response`
- `material_pass_gaps`
- `next_required_evidence`
- `number_from_layer`
- `pass_acceptance`
- `pass_order`
- `pass_specific_evidence`
- `pass_specific_gaps`
- `quality_first_enabled`
- `quality_first_material_gaps`
- `reference_pbr_usable`
- `review_completes_pass`
- `spec_has_hair`
- `status_payload`
- `surface_pass_gaps`
- `sync_pipeline`
- `visual_evidence`
- `write_spec`

---

## [img2threejs\forge\stage3_build\uv_unwrap.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage3_build/uv_unwrap.py)

**Details:** Source code file.

**Functions / Classes:**
- `_chart_adjacency`
- `_conjugate_gradient`
- `_cross`
- `_dot`
- `_face_normal`
- `_format_summary`
- `_local_coordinates`
- `_norm`
- `_split_chart`
- `_sub`
- `_triangles`
- `chart_distortion`
- `chart_is_disk`
- `enforce_disk_charts`
- `lscm`
- `main`
- `multiply`
- `multiply_transpose`
- `pack_charts`
- `percentile`
- `segment_charts`
- `unwrap`

---

## [img2threejs\forge\stage3_build\visual_hull.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage3_build/visual_hull.py)

**Details:** Source code file.

**Functions / Classes:**
- `_boundary_surface`
- `_is_number`
- `_mask_lookup`
- `_sample_mask`
- `_validate_mask`
- `_validate_vector`
- `carve_visual_hull`
- `centre`
- `corner`
- `main`
- `validate_visual_hull_descriptor`

---

## [img2threejs\forge\stage4_review\append_review.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/append_review.py)

**Details:** Source code file.

**Functions / Classes:**
- `clamp_score`
- `is_remote_or_virtual_path`
- `load_json_argument`
- `load_spec`
- `main`
- `pass_acceptance`
- `pass_order`
- `pass_specific_evidence`
- `review_completes_pass`
- `split_items`
- `sync_pipeline`
- `validate_optional_file`
- `visual_acceptance_config`
- `visual_acceptance_threshold`

---

## [img2threejs\forge\stage4_review\attachment_anchor.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/attachment_anchor.py)

**Details:** Source code file.

**Functions / Classes:**
- `_anchor_extent`
- `_anchor_id`
- `_distance`
- `_find_cycle`
- `_format_summary`
- `_is_attachment_component`
- `_is_number`
- `_is_xyz`
- `_load_json`
- `_max_offset_for`
- `_parse_measured`
- `analyze_attachments`
- `main`

---

## [img2threejs\forge\stage4_review\calibrate_eye.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/calibrate_eye.py)

**Details:** Source code file.

**Functions / Classes:**
- `_signal_stats`
- `calibrate`
- `main`
- `run_corpus`
- `separation`

---

## [img2threejs\forge\stage4_review\check_part_coverage.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/check_part_coverage.py)

**Details:** Source code file.

**Functions / Classes:**
- `collect_local_feature_keys`
- `find_inventory`
- `load`
- `main`
- `norm`
- `severity_for`

---

## [img2threejs\forge\stage4_review\compare_region_passes.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/compare_region_passes.py)

**Details:** Source code file.

**Functions / Classes:**
- `_aligned_pixels`
- `_iou`
- `_load`
- `_mask_from_id`
- `_resolve`
- `_similarity`
- `compare_capture`
- `main`

---

## [img2threejs\forge\stage4_review\correction_loop.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/correction_loop.py)

**Details:** Source code file.

**Functions / Classes:**
- `_is_finite_number`
- `_routing_state`
- `_validate_config`
- `_validate_history`
- `_validate_tags`
- `budget_exceeded`
- `decide`
- `main`

---

## [img2threejs\forge\stage4_review\cs2_review.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/cs2_review.py)

**Details:** Source code file.

**Functions / Classes:**
- `_critical_feature_failures`
- `_failed_threshold`
- `_load_object`
- `_number`
- `_region_results`
- `_write_json_atomic`
- `evaluate_knife_review`
- `load_review_scene`
- `main`

---

## [img2threejs\forge\stage4_review\diagnose_render.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/diagnose_render.py)

**Details:** Source code file.

**Functions / Classes:**
- `bbox_of`
- `bilateral_symmetry_error`
- `color_is_gated`
- `largest_component`
- `load_mask`
- `main`
- `mask_is_inverted`
- `per_part_color_delta`
- `proportion_delta`
- `record_tier1_result`
- `render_hash`
- `run_tier1`
- `silhouette_iou`
- `strip_material_maps`

---

## [img2threejs\forge\stage4_review\diagnose_render_multi_angle.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/diagnose_render_multi_angle.py)

**Details:** Source code file.

**Functions / Classes:**
- `_format_summary`
- `analyze_angles`
- `main`
- `silhouette_area_fraction`

---

## [img2threejs\forge\stage4_review\divine_eye.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/divine_eye.py)

**Details:** Source code file.

**Functions / Classes:**
- `_banded_median_lab`
- `_blown_fraction`
- `_foreground_hsv_stats`
- `_mean`
- `_sobel_edges`
- `blowout_parity`
- `edge_overlap`
- `evaluate`
- `flat_fraction`
- `g`
- `global_ssim`
- `hist`
- `hue_zone_parity`
- `load_luma`
- `main`
- `specular_wash`
- `tonal_parity`

---

## [img2threejs\forge\stage4_review\fit_params.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/fit_params.py)

**Details:** Source code file.

**Functions / Classes:**
- `DivineEyeFitResult`
- `FitConfig`
- `FitInputError`
- `FitResult`
- `FitTelemetry`
- `NonFiniteScoreError`
- `__str__`
- `_cli_config`
- `_default_divine_eye_evaluator`
- `_divine_eye_objective_score`
- `_finite_parameter`
- `_finite_score`
- `_is_positive_integer`
- `_normalize_inputs`
- `_quadratic_objective`
- `_replace_coordinate`
- `_result`
- `_selected_raw_fidelity`
- `_validate_config`
- `divine_eye_correction_history`
- `divine_eye_fidelity`
- `fit`
- `fit_against_divine_eye`
- `main`
- `objective`
- `to_correction_history`
- `to_json`

---

## [img2threejs\forge\stage4_review\geometry_integrity.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/geometry_integrity.py)

**Details:** Source code file.

**Functions / Classes:**
- `_axis_index`
- `_blade_thickness`
- `_bounds`
- `_has_reduced_lod_tiers`
- `_normal_consistency`
- `_seam_overlap`
- `_triangle_count`
- `_vertex_key`
- `measure_geometry_integrity`
- `mesh_edge_counts`
- `numeric_values`

---

## [img2threejs\forge\stage4_review\hair_gate.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/hair_gate.py)

**Details:** Source code file.

**Functions / Classes:**
- `_pairs`
- `compare_views`
- `hair_gate`
- `main`

---

## [img2threejs\forge\stage4_review\interior_difference.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/interior_difference.py)

**Details:** Source code file.

**Functions / Classes:**
- `_bbox_corners`
- `compare`
- `main`
- `sample`

---

## [img2threejs\forge\stage4_review\joint_loops.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/joint_loops.py)

**Details:** Source code file.

**Functions / Classes:**
- `_dot`
- `_format_summary`
- `_norm`
- `_sub`
- `_triangles`
- `analyze_joint_loops`
- `count_loops_at_joint`
- `main`

---

## [img2threejs\forge\stage4_review\make_comparison_sheet.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/make_comparison_sheet.py)

**Details:** Source code file.

**Functions / Classes:**
- `blit`
- `chunk`
- `composite_over_checker`
- `create_sheet`
- `fill_rect`
- `load_image`
- `main`
- `paeth_predictor`
- `read_png`
- `resize_cover`
- `write_png_rgb`

---

## [img2threejs\forge\stage4_review\material_comparator.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/material_comparator.py)

**Details:** Source code file.

**Functions / Classes:**
- `_expected_mismatch`
- `_features`
- `_grid`
- `_luma`
- `_mean`
- `_similarity`
- `compare_material_crops`
- `main`

---

## [img2threejs\forge\stage4_review\material_feedback.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/material_feedback.py)

**Details:** Source code file.

**Functions / Classes:**
- `_base`
- `_prior_bounds`
- `apply_material_feedback`
- `main`
- `propose_patch`

---

## [img2threejs\forge\stage4_review\material_gate.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/material_gate.py)

**Details:** Source code file.

**Functions / Classes:**
- `main`
- `run_material_gate`

---

## [img2threejs\forge\stage4_review\material_views.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/material_views.py)

**Details:** Source code file.

**Functions / Classes:**
- `_norm`
- `build_view_plan`
- `crop_visible_footprint`
- `main`
- `validate_capture`

---

## [img2threejs\forge\stage4_review\mesh_reference_compare.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/mesh_reference_compare.py)

**Details:** Source code file.

**Functions / Classes:**
- `apply`
- `band_profile`
- `find_landmarks`
- `landmark_bands`
- `local_matrix`
- `main`
- `multiply`
- `narrowest`
- `neck_above`
- `normalise`
- `percentile`
- `read_accessor`
- `read_glb_positions`
- `walk`
- `width_curve`

---

## [img2threejs\forge\stage4_review\multi_pass.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/multi_pass.py)

**Details:** Source code file.

**Functions / Classes:**
- `_sha256`
- `default_pass_records`
- `record_pass`
- `validate_pass_records`

---

## [img2threejs\forge\stage4_review\objectness.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/objectness.py)

**Details:** Source code file.

**Functions / Classes:**
- `_bbox`
- `_resample_bbox`
- `_to_gray`
- `cosine`
- `descriptor`
- `main`
- `objectness_similarity`

---

## [img2threejs\forge\stage4_review\pairwise_penetration.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/pairwise_penetration.py)

**Details:** Source code file.

**Functions / Classes:**
- `_DirectionIndex`
- `__init__`
- `_bounds`
- `_boxes_overlap`
- `_cell`
- `_crossings`
- `_format_summary`
- `_project`
- `_sample_points`
- `_triangles`
- `analyze_meshes`
- `analyze_pair`
- `build_indices`
- `candidates`
- `main`
- `point_inside`

---

## [img2threejs\forge\stage4_review\per_feature.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/per_feature.py)

**Details:** Source code file.

**Functions / Classes:**
- `_fmt`
- `_format_text`
- `_load_scores`
- `_load_targets`
- `evaluate_features`
- `is_gating`
- `main`
- `threshold_for`

---

## [img2threejs\forge\stage4_review\render_bridge.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/render_bridge.py)

**Details:** Source code file.

**Functions / Classes:**
- `diagnose`
- `find_capture`
- `init_manifest`
- `main`
- `manifest_path`
- `now_utc`
- `portable_path`
- `read_manifest`
- `record_capture`
- `record_capture_pass`
- `record_reference_capture`
- `sha256`
- `validate_manifest`
- `write_manifest`

---

## [img2threejs\forge\stage4_review\scalp_exposure.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/scalp_exposure.py)

**Details:** Source code file.

**Functions / Classes:**
- `_PointGrid`
- `__init__`
- `_key`
- `_load_points`
- `largest_exposed_run`
- `main`
- `near`
- `scalp_exposure`

---

## [img2threejs\forge\stage4_review\self_intersection.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/self_intersection.py)

**Details:** Source code file.

**Functions / Classes:**
- `_DirectionGrid`
- `__init__`
- `_as_point`
- `_cell_index`
- `_count_crossings`
- `_error_result`
- `_format_summary`
- `_load_meshes`
- `_normalize`
- `_triangles`
- `analyze_mesh`
- `analyze_meshes`
- `candidates`
- `main`

---

## [img2threejs\forge\stage4_review\swept_arc_gate.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/swept_arc_gate.py)

**Details:** Source code file.

**Functions / Classes:**
- `_load_json`
- `_mean`
- `analyse`
- `angular_span`
- `best_fit_plane`
- `evaluate`
- `fit_arc_centre`
- `main`
- `record`
- `symmetric_eigenvalues`

---

## [img2threejs\forge\stage4_review\turntable_gate.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/turntable_gate.py)

**Details:** Source code file.

**Functions / Classes:**
- `_analyze_holes`
- `_circular_distance`
- `_format_summary`
- `_load_mask`
- `_normalize_azimuth`
- `_parse_capture`
- `analyze_turntable`
- `index`
- `main`

---

## [img2threejs\forge\stage4_review\validate_render_profile.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/validate_render_profile.py)

**Details:** Source code file.

**Functions / Classes:**
- `_is_vec`
- `main`
- `validate_file`
- `validate_profile`

---

## [img2threejs\forge\stage4_review\vertex_region_gate.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/vertex_region_gate.py)

**Details:** Source code file.

**Functions / Classes:**
- `_hex_to_rgb`
- `_load_json`
- `classify`
- `collect_vertices`
- `evaluate`
- `main`
- `measure`
- `project`
- `projected_blobs`
- `union_box`

---

## [img2threejs\forge\stage4_review\vlm_gate.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/vlm_gate.py)

**Details:** Source code file.

**Functions / Classes:**
- `_median`
- `aggregate_samples`
- `calibrate`
- `evidence_consistent`
- `gate`
- `main`

---

## [img2threejs\forge\stage4_review\_fit_divine_eye.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage4_review/_fit_divine_eye.py)

**Details:** Source code file.

**Functions / Classes:**
- `_approval_state`
- `is_approved_divine_eye_result`
- `normalize_history`

---

## [img2threejs\forge\stage5_rig\emit_rig.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage5_rig/emit_rig.py)

**Details:** Source code file.

**Functions / Classes:**
- `_fmt_num`
- `emit_typescript`

---

## [img2threejs\forge\stage5_rig\geodesic_skinning.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage5_rig/geodesic_skinning.py)

**Details:** Source code file.

**Functions / Classes:**
- `VoxelGrid`
- `__init__`
- `_bounds`
- `_fill_interior`
- `_format_summary`
- `_rasterize`
- `_segment_voxels`
- `_triangles`
- `bind`
- `euclidean_bind`
- `geodesic_field`
- `index_of`
- `is_rigid`
- `main`
- `partition_for_binding`
- `point_to_segment`
- `ride`

---

## [img2threejs\forge\stage5_rig\rig_spec.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage5_rig/rig_spec.py)

**Details:** Source code file.

**Functions / Classes:**
- `BoneSpec`
- `Ellipsoid`
- `IkSpec`
- `RigSpec`
- `bone_by_id`
- `children_of`
- `derive_envelope_radius`
- `resolve_tip_positions`
- `root`
- `validate_rig_spec`

---

## [img2threejs\forge\stage5_rig\validate_rig_payload.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage5_rig/validate_rig_payload.py)

**Details:** Source code file.

**Functions / Classes:**
- `distance`
- `finite_number`
- `main`
- `matrix16`
- `validate`
- `vector3`

---

## [img2threejs\forge\stage5_rig\__init__.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/stage5_rig/__init__.py)

**Details:** Source code file.

*No functions detected.*

---

## [img2threejs\forge\tests\showcase_test_support.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/showcase_test_support.py)

**Details:** Source code file.

**Functions / Classes:**
- `showcase_root`

---

## [img2threejs\forge\tests\test_albedo_color_space.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_albedo_color_space.py)

**Details:** Source code file.

**Functions / Classes:**
- `AlbedoColorSpace`
- `spec`
- `test_a_dark_albedo_survives_the_round_trip_at_the_right_value`
- `test_a_mid_grey_is_also_affected_so_this_is_not_a_black_only_quirk`
- `test_the_emitted_helper_names_the_colour_space`

---

## [img2threejs\forge\tests\test_analyze_texture.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_analyze_texture.py)

**Details:** Source code file.

**Functions / Classes:**
- `AnalyzeTextureTest`
- `_mk`
- `chunk`
- `cl`
- `fn`
- `setUp`
- `test_all_recipes_have_required_scalars`
- `test_apply_to_material_writes_recipe`
- `test_chrome_specular_doppler_is_gem_metal`
- `test_directional_streaks_is_brushed_steel`
- `test_flat_saturated_is_painted_metal`
- `test_in_place_requires_patch_target`
- `test_mottled_grey_is_worn_composite`
- `test_patch_target_requires_spec_and_material_id_together`
- `test_pigment_dominant_doppler_is_candy_coat`
- `write_png`

---

## [img2threejs\forge\tests\test_attachment_anchor.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_attachment_anchor.py)

**Details:** Source code file.

**Functions / Classes:**
- `AttachmentAnchorGate`
- `_base_spec`
- `_tags`
- `test_anchor_at_root_fires_anchor_not_root`
- `test_base_fixture_passes`
- `test_charm_regression_anchor_proximity_fires_with_default_offset`
- `test_component_absent_from_measured_lands_in_unmeasured`
- `test_dangling_anchor_fires_anchor_resolves`
- `test_hat_regression_anchor_proximity_fires_with_matching_distance`
- `test_missing_anchor_fires_anchor_declared`
- `test_mutual_anchors_fire_anchor_not_cyclic`
- `test_no_attachments_passes_and_reports_zero_count`

---

## [img2threejs\forge\tests\test_attachment_does_not_override_primitive.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_attachment_does_not_override_primitive.py)

**Details:** Source code file.

**Functions / Classes:**
- `AttachmentDoesNotOverridePrimitive`
- `_emit`
- `spec_with`
- `test_a_cylinder_with_an_attachment_still_derives_geometry_from_its_endpoints`
- `test_a_non_attachment_primitive_still_carries_its_attachment_contract`
- `test_a_tapered_sweep_with_an_attachment_keeps_its_swept_geometry`
- `test_an_ellipsoid_with_an_attachment_does_not_take_the_endpoint_geometry_path`
- `test_an_implicit_component_is_placed_by_its_transform_not_its_attachment`
- `test_every_attachment_primitive_still_takes_the_endpoint_path`
- `test_the_part_keeps_its_authored_dimensions`

---

## [img2threejs\forge\tests\test_calibrate_eye.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_calibrate_eye.py)

**Details:** Source code file.

**Functions / Classes:**
- `CalibrateEyeTest`
- `_corpus`
- `block`
- `chunk`
- `setUp`
- `test_clean_separation_and_acceptable`
- `test_corpus_needs_both_classes`
- `test_report_only_flag_set`
- `test_run_corpus_collects_per_label`
- `write_rgb_png`

---

## [img2threejs\forge\tests\test_camera_fitting.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_camera_fitting.py)

**Details:** Source code file.

**Functions / Classes:**
- `CameraFittingContractTest`
- `FixtureCamera`
- `FixtureCorrespondence`
- `KnownCameraCase`
- `make_known_camera_case`
- `test_camera_fit_output_is_deterministic`
- `test_known_camera_converges_with_low_reprojection_error`
- `test_public_compatibility_exports_remain_available`
- `test_solver_termination_is_bounded_by_public_limits`

---

## [img2threejs\forge\tests\test_camera_fitting_cli.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_camera_fitting_cli.py)

**Details:** Source code file.

**Functions / Classes:**
- `CameraFittingCliTest`
- `test_legacy_cli_emits_descriptor_and_writes_matching_out_file`

---

## [img2threejs\forge\tests\test_camera_fitting_safety.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_camera_fitting_safety.py)

**Details:** Source code file.

**Functions / Classes:**
- `CameraFittingSafetyTest`
- `FixtureCamera`
- `FixtureCorrespondence`
- `base_camera`
- `base_correspondences`
- `camera_with_dimensions`
- `test_rejects_degenerate_world_landmarks`
- `test_rejects_fewer_than_six_correspondences`
- `test_rejects_invalid_image_dimensions`
- `test_rejects_non_finite_correspondence_inputs`
- `test_rejects_non_finite_initial_camera_inputs`
- `test_rejects_non_projectable_initial_camera`

---

## [img2threejs\forge\tests\test_character_rig_derivation.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_character_rig_derivation.py)

**Details:** Source code file.

**Functions / Classes:**
- `CharacterPoseApplication`
- `CharacterRigDerivation`
- `_as_rig_spec`
- `_length`
- `setUpClass`
- `test_clavicles_are_arm_chain_bones_rooted_on_the_chest`
- `test_derived_rig_satisfies_the_rig_spec_gate`
- `test_deriving_a_rig_from_a_posed_tree_fails_closed`
- `test_details_are_not_bones`
- `test_joint_angles_land_on_the_anatomically_correct_components`
- `test_left_and_right_limbs_are_mirrored_in_x`
- `test_limb_chains_are_fully_linked_per_side`
- `test_no_anatomy_applies_no_pose`
- `test_no_bone_is_degenerate`
- `test_rig_is_derived_at_bind_pose_not_posed`
- `test_single_root_is_the_pelvis`
- `test_spine_bones_point_upward`
- `test_spine_chain_is_contiguous`

---

## [img2threejs\forge\tests\test_chirality.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_chirality.py)

**Details:** Source code file.

**Functions / Classes:**
- `NamingPairs`
- `NestedPairSideNaming`
- `SpecLevelGate`
- `TheConvention`
- `TheFootDefect`
- `TheHandDefect`
- `WholeFigureSanity`
- `_spec`
- `build`
- `part`
- `run_spec`
- `test_a_correctly_mirrored_inboard_toe_is_not_flagged`
- `test_a_direction_mirrors_by_the_same_rule`
- `test_a_drifted_pair_raises_the_number`
- `test_a_left_named_component_sitting_on_the_right_warns`
- `test_a_magnitude_difference_alone_is_not_a_chirality_failure`
- `test_a_malformed_point_is_rejected`
- `test_a_mirror_negates_the_lateral_axis_and_nothing_else`
- `test_a_mirrored_pair_on_the_right_convention_is_clean`
- `test_a_part_on_the_midline_hides_the_defect`
- `test_a_perfect_mirror_pair_can_still_both_be_wrong`
- `test_a_rotated_pair_is_a_hard_error`
- `test_a_stem_survives_internal_hyphens`
- `test_a_symmetric_figure_reports_near_zero`
- `test_a_symmetric_reference_cannot_judge_handedness_and_says_so`
- `test_a_toe_that_really_crosses_the_midline_is_still_flagged`
- `test_both_halves_on_the_same_side_is_reported_as_such`
- `test_components_on_the_midline_are_not_judged`
- `test_medial_is_derived_from_which_side_the_limb_is_on`
- `test_no_points_does_not_raise`
- `test_no_samples_does_not_raise`
- `test_only_complete_pairs_are_returned`
- `test_sides_are_read_off_the_suffix`
- `test_the_characters_left_is_plus_x`
- `test_the_defect_fails_the_pair_check`
- `test_the_defect_is_lateral_heavy_and_is_caught`
- `test_the_defect_is_named_a_rotation_not_just_a_mismatch`
- `test_the_fix_passes`
- `test_the_fixed_pair_passes`
- `test_the_floor_is_low_enough_to_see_the_real_reference`
- `test_the_generators_own_convention_passes_clean`
- `test_the_reference_is_medial_heavy`
- `test_the_right_half_comes_first`
- `test_unpaired_and_untransformed_components_are_ignored`

---

## [img2threejs\forge\tests\test_color_metrics.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_color_metrics.py)

**Details:** Source code file.

**Functions / Classes:**
- `ColorMetricsTest`
- `test_ciede2000_matches_sharma_reference`
- `test_delta_e_rgb_same_colour_zero`
- `test_same_hue_zone_threshold`
- `test_symmetry_and_identity`

---

## [img2threejs\forge\tests\test_color_recipe.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_color_recipe.py)

**Details:** Source code file.

**Functions / Classes:**
- `ColorGradientDetectionTest`
- `LabKmeansPaletteTest`
- `LabToRgbaRoundTripTest`
- `RoughnessFromHotspotTest`
- `SrgbToLabTest`
- `checker_pixel`
- `chunk`
- `grad_pixel`
- `setUp`
- `test_checkerboard_pattern_yields_no_gradient`
- `test_flat_color_yields_no_gradient`
- `test_linear_gradient_is_detected_with_correct_axis`
- `test_pure_red_matches_reference_values`
- `test_round_trip_within_one_unit`
- `test_tight_hotspot_is_lower_roughness_than_broad_hotspot`
- `test_two_known_colors_in_known_split`
- `test_white_is_l100_a0_b0`
- `write_rgb_png`

---

## [img2threejs\forge\tests\test_correction_loop.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_correction_loop.py)

**Details:** Source code file.

**Functions / Classes:**
- `CorrectionLoopTest`
- `_it`
- `test_budget_exceeded_helper`
- `test_budget_exceeded_rejects_invalid_inputs`
- `test_cli_rejects_invalid_configuration_and_history_without_traceback`
- `test_cli_rejects_tampered_nested_divine_eye_fidelity`
- `test_cli_rejects_tampered_nested_divine_eye_routing`
- `test_cli_routes_forged_pending_false_probe_to_request_input`
- `test_decide_rejects_invalid_configuration_and_history_records`
- `test_empty_history_continues`
- `test_hard_ceiling_always_terminates`
- `test_interrupted_reverts_do_not_oscillate`
- `test_loop_cannot_exceed_max_iter`
- `test_nested_divine_eye_provenance_drives_pending_routing`
- `test_nested_divine_eye_rejects_tampered_top_level_fidelity`
- `test_nested_divine_eye_rejects_tampered_top_level_routing`
- `test_non_approved_routing_overrides_forged_pending_false`
- `test_oscillation_two_consecutive_reverts_stops`
- `test_pending_review_blocks_success_and_preserves_routing`
- `test_plateau_stops_request_input`
- `test_repeated_defect_stops_refine_spec`
- `test_score_flip_without_reverts_does_not_oscillate`
- `test_success_requires_no_defects`
- `test_success_requires_no_hard_gate_failures`
- `test_success_when_target_met_and_no_defects`

---

## [img2threejs\forge\tests\test_cs2_foundation.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_cs2_foundation.py)

**Details:** Source code file.

**Functions / Classes:**
- `AdapterAndReviewTests`
- `IdentityFoundationTests`
- `TextureFoundationTests`
- `test_ambiguous_metadata_preserves_candidates`
- `test_explicit_metadata_wins_over_resolved_and_classification`
- `test_manifest_enrichment_keeps_image_only_tier`
- `test_manifest_evidence_reaches_assessment_and_spec`
- `test_map_classifier_maps_independent_channels`
- `test_missing_float_seed_and_hidden_view_are_explicit_approximations`
- `test_only_knife_adapter_is_registered`
- `test_packed_and_direct_assets_map_to_independent_pbr_channels`
- `test_projection_requires_camera_and_delit_unless_fallback`
- `test_review_scene_is_versioned_and_thresholds_are_frozen`
- `test_validator_rejects_invalid_exactness_route_pair`

---

## [img2threejs\forge\tests\test_cs2_manifest.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_cs2_manifest.py)

**Details:** Source code file.

**Functions / Classes:**
- `Cs2ManifestTests`
- `chunk`
- `test_classified_knife_proceeds_and_preserves_heuristic_signal`
- `test_image_only_knife_manifest_requires_authoritative_classification`
- `test_manifest_write_is_atomic_and_round_trips`
- `test_unsupported_family_never_receives_knife_adapter`
- `write_png`

---

## [img2threejs\forge\tests\test_cs2_review.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_cs2_review.py)

**Details:** Source code file.

**Functions / Classes:**
- `Cs2ReviewGateTest`
- `passing_inputs`
- `setUp`
- `test_append_review_persists_cs2_report_and_rejects_failed_report`
- `test_cli_writes_report_and_returns_verdict_status`
- `test_degenerate_orbit_is_blocking_and_missing_scene_metadata_is_error`
- `test_passing_knife_review_returns_machine_readable_report`
- `test_projection_coverage_and_identity_detail_are_blocking`
- `test_wrong_family_is_blocking_even_when_visual_metrics_pass`

---

## [img2threejs\forge\tests\test_decimation_wiring.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_decimation_wiring.py)

**Details:** Source code file.

**Functions / Classes:**
- `EmissionTest`
- `RatioReadingTest`
- `ValidationTest`
- `load_fixture`
- `test_a_non_numeric_ratio_is_rejected`
- `test_a_sane_ratio_validates`
- `test_a_usable_ratio_is_returned`
- `test_absent_descriptor_means_no_decimation`
- `test_decimation_is_emitted_before_the_skin_weight_pass`
- `test_decimation_is_refused_on_authored_uvs`
- `test_generated_uv_strategies_stay_allowed`
- `test_helper_and_call_appear_with_the_requested_ratio`
- `test_helper_is_absent_when_nothing_asks_for_it`
- `test_out_of_range_ratios_are_ignored`
- `test_ratios_outside_the_open_unit_interval_are_rejected`
- `test_the_dense_source_is_kept_addressable`
- `with_decimation`

---

## [img2threejs\forge\tests\test_divine_eye.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_divine_eye.py)

**Details:** Source code file.

**Functions / Classes:**
- `DegenerateEvidenceTest`
- `DivineEyeIntegrationTest`
- `SignalUnitTest`
- `block`
- `chunk`
- `lshape`
- `setUp`
- `test_asymmetric_subject_not_penalized_when_matched`
- `test_blowout_parity_penalizes_extra_blown`
- `test_different_shape_iou_fail_is_not_rescued`
- `test_edge_overlap_identical_is_one`
- `test_edge_overlap_no_edges_is_not_free_evidence`
- `test_empty_union_is_not_a_perfect_match`
- `test_flat_fraction_high_for_uniform`
- `test_identical_passes_with_full_fidelity`
- `test_mask_inversion_warning_is_explicit`
- `test_shifted_same_shape_is_rescued_by_objectness`
- `test_ssim_different_is_low`
- `test_ssim_identical_is_one`
- `test_tiny_disjoint_subjects_are_hard_rejected`
- `test_tonal_parity_disjoint_is_low`
- `test_tonal_parity_identical_is_one`
- `test_wrong_scale_trips_hard_gate`
- `write_rgb_png`

---

## [img2threejs\forge\tests\test_fit_params.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_fit_params.py)

**Details:** Source code file.

**Functions / Classes:**
- `FitParamsTest`
- `evaluator`
- `objective`
- `quadratic`
- `render_for_parameters`
- `test_best_score_history_is_monotonic_and_normalizes_for_correction_loop`
- `test_budget_exhaustion_commits_evaluated_coordinate_improvement`
- `test_cli_json_roundtrip`
- `test_cli_rejects_malformed_bounds_without_traceback`
- `test_cli_rejects_unknown_config_keys_without_traceback`
- `test_cli_requires_exact_top_level_schema`
- `test_direct_call_rejects_invalid_config_and_objective`
- `test_divine_eye_adapter_reads_fidelity_without_changing_gate_keys`
- `test_divine_eye_adapter_rejects_invalid_fidelity`
- `test_divine_eye_adapter_rejects_non_mapping_results`
- `test_divine_eye_history_compares_attempts_to_last_accepted_fidelity`
- `test_divine_eye_history_copies_rich_provenance`
- `test_divine_eye_history_preserves_pending_review_routing`
- `test_divine_eye_history_preserves_per_iteration_hard_gates_for_correction_loop`
- `test_divine_eye_history_rejects_malformed_direct_inputs`
- `test_fit_against_divine_eye_bounds_all_gated_runs_with_raw_provenance`
- `test_fit_against_divine_eye_normalizes_fidelity_only_result_without_mutation`
- `test_fit_against_divine_eye_rejects_higher_fidelity_hard_gate_as_best`
- `test_fit_against_divine_eye_rejects_higher_fidelity_probe_as_best`
- `test_fit_against_divine_eye_runs_evaluator_and_preserves_provenance`
- `test_fit_against_divine_eye_snapshots_reused_evaluator_mapping`
- `test_fit_config_rejects_invalid_limits_minimum_improvement_and_seed`
- `test_hard_gated_result_does_not_replace_accepted_fidelity`
- `test_non_consecutive_direction_flips_do_not_oscillate`
- `test_one_unstable_iteration_with_multiple_reversals_does_not_oscillate`
- `test_pending_high_fidelity_does_not_replace_approved_baseline`
- `test_rejects_invalid_bounds_and_non_finite_scores`
- `test_rejects_malformed_bounds_with_field_specific_input_errors`
- `test_seeded_metadata_and_result_are_deterministic`
- `test_smooth_quadratic_refinement_does_not_count_boundary_bracketing_as_oscillation`
- `test_stops_at_max_evaluations`
- `test_stops_on_direction_oscillation`
- `test_stops_on_plateau`

---

## [img2threejs\forge\tests\test_geodesic_skinning.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_geodesic_skinning.py)

**Details:** Source code file.

**Functions / Classes:**
- `Reporting`
- `TheDefectThisFixes`
- `Voxelization`
- `WeightInvariants`
- `arm_weight`
- `box`
- `merge`
- `setUpClass`
- `test_a_detached_island_is_reported_not_silently_pinned`
- `test_a_solid_box_is_filled_not_hollow`
- `test_arm_vertices_still_belong_to_the_arm`
- `test_euclidean_leaks_across_the_gap_and_geodesic_does_not`
- `test_every_vertex_gets_four_slots`
- `test_no_negative_weights`
- `test_rejects_input_it_cannot_bind`
- `test_solid_voxels_exceed_surface_voxels`
- `test_the_distance_field_routes_around_the_shoulder`
- `test_the_gap_between_torso_and_arm_stays_empty`
- `test_the_probe_vertex_really_is_euclidean_close_to_the_arm`
- `test_weights_are_normalised`
- `torso_with_hanging_arm`

---

## [img2threejs\forge\tests\test_geometry_derivation.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_geometry_derivation.py)

**Details:** Source code file.

**Functions / Classes:**
- `LatheProfileTest`
- `circle_mask`
- `rect_mask`
- `test_axis_picks_longer_dimension`
- `test_axis_positions_span_normalized_range`
- `test_circle_radius_peaks_in_middle`
- `test_rectangle_radius_roughly_constant`
- `test_triangle_radius_increases_top_to_bottom`
- `triangle_mask`

---

## [img2threejs\forge\tests\test_glb_reference.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_glb_reference.py)

**Details:** Source code file.

**Functions / Classes:**
- `GlbReferenceProbeTest`
- `chunk`
- `test_probe_extracts_reference_inventory_and_bounds`
- `test_render_manifest_requires_browser_glb_baseline`
- `test_v2_manifest_declares_shared_profile_and_six_passes`
- `write_png`
- `write_triangle_glb`

---

## [img2threejs\forge\tests\test_gradient_stops.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_gradient_stops.py)

**Details:** Source code file.

**Functions / Classes:**
- `GradientStopsTest`
- `chunk`
- `px`
- `setUp`
- `test_deterministic`
- `test_extracts_three_zones_in_order`
- `test_flags_blue_collapse_on_violet`
- `test_hue_name_boundaries`
- `write_rgb_png`

---

## [img2threejs\forge\tests\test_hair_evidence.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_hair_evidence.py)

**Details:** Source code file.

**Functions / Classes:**
- `BandedCoverage`
- `Hairline`
- `HonestyAboutWhatWasNotSeen`
- `OtsuBehaviour`
- `RealReferenceViews`
- `Shading`
- `ThresholdIsNotATautology`
- `chunk`
- `head_image`
- `pixel`
- `shaded`
- `test_a_bald_head_under_a_key_light_is_still_rejected`
- `test_a_flat_mass_reports_no_root_to_tip_delta_worth_having`
- `test_a_frontal_only_set_reports_the_rear_as_unobserved`
- `test_a_head_with_no_hair_is_reported_as_having_no_split`
- `test_a_set_that_includes_a_rear_view_does_not_claim_it_is_missing`
- `test_a_single_view_reports_that_depth_is_unobservable`
- `test_a_uniform_spread_scores_the_theoretical_unimodal_value`
- `test_an_empty_population_does_not_raise`
- `test_confidence_rises_with_the_number_of_usable_views`
- `test_every_band_is_reported_even_when_empty`
- `test_hair_confined_to_the_top_shows_in_the_crown_band_only`
- `test_lock_geometry_is_explicitly_not_reported`
- `test_more_hair_in_the_image_reports_more_hair`
- `test_one_population_reports_no_separation`
- `test_the_consensus_hairline_reaches_faceLandmarks`
- `test_the_delta_sign_convention_is_documented_not_assumed`
- `test_the_hairline_tracks_where_the_hair_actually_stops`
- `test_the_highlight_row_is_found`
- `test_the_no_split_case_says_why`
- `test_the_reference_views_disagree_with_each_other_in_the_right_direction`
- `test_the_split_moves_with_the_data_not_with_the_count`
- `test_two_clear_populations_split_between_them`
- `test_two_tight_clusters_score_far_above_the_floor`
- `write_png`

---

## [img2threejs\forge\tests\test_hair_gate.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_hair_gate.py)

**Details:** Source code file.

**Functions / Classes:**
- `Deltas`
- `HardBeatsSoft`
- `MissingExposureIsAGapNotAPass`
- `OrchestratorWiring`
- `ShadingIsNamedAsMaterial`
- `Thresholds`
- `build`
- `hair_spec`
- `run`
- `test_a_bald_patch_fails_even_when_every_view_matches`
- `test_a_chair_is_not_a_hair_subject`
- `test_a_coverage_shortfall_alone_is_review_not_fail`
- `test_a_displaced_highlight_says_adding_hair_will_not_fix_it`
- `test_a_hair_subject_is_detected_by_component_role`
- `test_a_hair_subject_is_detected_by_profile_alone`
- `test_a_non_hair_subject_is_not_asked_for_hair_evidence`
- `test_a_shortfall_past_the_threshold_is_flagged`
- `test_a_shortfall_under_the_threshold_is_not`
- `test_a_view_absent_from_the_render_is_reported`
- `test_an_identical_pair_passes`
- `test_an_unmeasurable_view_carries_both_statuses`
- `test_having_MORE_hair_than_the_reference_is_not_a_shortfall`
- `test_omitting_the_geometric_gate_is_reported`
- `test_scalp_exposure_is_demanded_for_a_visual_pass_on_a_hair_subject`
- `test_the_cli_does_not_exit_zero_when_the_hard_channel_never_ran`
- `test_the_completed_pass_demands_nothing`
- `test_the_hair_gate_is_demanded_too`
- `test_the_missing_channel_is_a_flag_not_just_prose`
- `test_the_reason_is_stated_not_just_the_absence`
- `test_the_report_says_a_shortfall_does_not_authorise_widening`
- `test_the_thresholds_declare_themselves_uncalibrated`
- `test_what_neither_side_observed_is_carried_through`
- `view`

---

## [img2threejs\forge\tests\test_hair_material.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_hair_material.py)

**Details:** Source code file.

**Functions / Classes:**
- `EmittedSourceTypechecks`
- `GradientDescriptor`
- `GradientEmission`
- `TheMaterialReference`
- `fixture_spec`
- `setUp`
- `test_a_code_only_hair_profile_exists_and_needs_no_maps`
- `test_a_factory_with_hair_shading_typechecks`
- `test_a_malformed_gradient_is_none_not_a_default`
- `test_a_mass_with_no_extent_does_not_divide_by_zero`
- `test_a_well_formed_gradient_is_read`
- `test_an_unknown_axis_falls_back_to_y_rather_than_emitting_nonsense`
- `test_both_hair_profiles_label_their_basis_as_a_prior`
- `test_hair_human_now_carries_sheen`
- `test_nothing_is_emitted_when_no_component_asks_for_one`
- `test_the_axis_defaults_to_y`
- `test_the_code_only_profile_admits_it_is_not_calibrated`
- `test_the_code_only_profile_leans_harder_on_shading_than_the_textured_one`
- `test_the_gradient_runs_after_the_scale`
- `test_the_helper_and_the_call_are_emitted`
- `test_the_material_is_cloned_before_vertex_colours_are_enabled`
- `test_the_ramp_runs_along_the_mass_own_axis`
- `test_the_registry_still_validates`

---

## [img2threejs\forge\tests\test_hair_profile.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_hair_profile.py)

**Details:** Source code file.

**Functions / Classes:**
- `Baseline`
- `Calibration`
- `ComponentLevelRejection`
- `HairlineAndFlow`
- `PrimitiveChoice`
- `RepresentationTier`
- `Structure`
- `TheRootRule`
- `check`
- `mass`
- `profile`
- `test_a_flagged_taper_is_silent`
- `test_a_hair_role_component_may_not_be_a_plane_card`
- `test_a_mass_tier_without_masses_is_an_error`
- `test_a_missing_flow_field_warns_with_the_recorded_reason`
- `test_a_missing_hairline_warns`
- `test_a_missing_root_is_rejected`
- `test_a_non_hair_component_may_still_be_a_plane_card`
- `test_a_non_object_profile_is_an_error`
- `test_a_plane_card_is_rejected_because_there_is_no_texture`
- `test_a_taper_without_an_uncalibrated_flag_warns`
- `test_a_tube_is_rejected_because_it_cannot_taper`
- `test_a_well_formed_profile_is_clean`
- `test_a_whorl_needs_a_position_on_the_scalp`
- `test_all_three_tiers_are_reachable`
- `test_an_absent_profile_is_not_an_error`
- `test_an_absolute_root_is_rejected_with_the_reason`
- `test_an_unknown_region_is_rejected`
- `test_an_unknown_tier_is_rejected`
- `test_an_unusable_primitive_names_the_alternatives`
- `test_an_xyz_root_is_rejected_too`
- `test_duplicate_mass_ids_are_rejected`
- `test_gravity_outside_the_unit_interval_is_an_error`
- `test_no_uncalibrated_field_is_silently_absent_from_the_list`
- `test_non_positive_dimensions_are_rejected`
- `test_shell_needs_no_masses`
- `test_the_default_is_shell`
- `test_the_lock_tier_declares_that_it_has_no_calibration`
- `test_the_rejection_table_carries_a_reason_for_every_entry`
- `test_the_report_lists_what_is_uncalibrated`
- `test_the_scalp_component_is_required`
- `test_too_few_control_points_is_an_error`
- `test_uv_outside_the_unit_square_is_rejected`

---

## [img2threejs\forge\tests\test_hierarchy_scale.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_hierarchy_scale.py)

**Details:** Source code file.

**Functions / Classes:**
- `HierarchyScaleTest`
- `compile_generated_module`
- `import_forge_modules`
- `setUpClass`
- `tearDownClass`
- `test_child_geometry_is_not_distorted_by_a_nonuniform_parent`
- `test_child_world_shape_is_undistorted_by_a_nonuniform_parent`
- `test_non_attachment_primitives_keep_strict_endpoint_types`
- `test_pivot_nodes_always_carry_identity_scale`
- `test_rotating_parent_moves_descendant`

---

## [img2threejs\forge\tests\test_hue_zone_parity.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_hue_zone_parity.py)

**Details:** Source code file.

**Functions / Classes:**
- `HueZoneParityTest`
- `_bar`
- `chunk`
- `fn`
- `setUp`
- `test_deterministic`
- `test_right_hue_scores_higher_than_wrong`
- `write_rgb_png`

---

## [img2threejs\forge\tests\test_humanoid_proportions.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_humanoid_proportions.py)

**Details:** Source code file.

**Functions / Classes:**
- `CanonTest`
- `IncompleteCanonTest`
- `SpecApplicationTest`
- `test_a_head_count_without_a_hip_line_is_refused`
- `test_canon_is_allowed_when_there_is_no_reference`
- `test_canon_is_labelled_as_canon_not_as_reference`
- `test_canon_is_refused_when_the_spec_names_a_reference`
- `test_eight_head_canon_satisfies_the_character_gate`
- `test_nonsense_head_counts_are_refused`
- `test_supported_heads_are_exactly_the_complete_tables`
- `test_the_classic_head_torso_legs_split_adds_up`
- `test_unsourced_landmarks_are_named_rather_than_invented`

---

## [img2threejs\forge\tests\test_humanoid_silhouette_profile.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_humanoid_silhouette_profile.py)

**Details:** Source code file.

**Functions / Classes:**
- `HumanoidSilhouetteProfile`
- `_profile_for`
- `setUpClass`
- `test_head_width_is_in_the_reference_range`
- `test_no_body_segment_is_a_slab`
- `test_no_component_emits_empty_geometry`
- `test_the_figure_tapers_toward_the_feet`
- `test_the_neck_to_shoulder_transition_is_a_slope_not_a_cliff`
- `test_the_profile_is_measurable`

---

## [img2threejs\forge\tests\test_intake_binding.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_intake_binding.py)

**Details:** Source code file.

**Functions / Classes:**
- `IntakeCorrectnessTest`
- `PropertyBindingTest`
- `test_brushed_metal_binds_anisotropy`
- `test_confident_contradiction_halts`
- `test_exposes_assumptions`
- `test_fabric_binds_sheen`
- `test_gem_binds_transmission_ior`
- `test_glossy_binds_clearcoat`
- `test_logo_hint_decal`
- `test_low_confidence_contradiction_does_not_halt`
- `test_match_confirms_and_proceeds`
- `test_no_verdict_proceeds_but_defers`
- `test_screws_hint_instancing`
- `test_unmatched_is_empty_but_safe`

---

## [img2threejs\forge\tests\test_interior_difference.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_interior_difference.py)

**Details:** Source code file.

**Functions / Classes:**
- `BboxConvention`
- `EvidenceWiring`
- `InteriorDifference`
- `_inside_figure`
- `blank_figure`
- `chunk`
- `featured_figure`
- `setUpClass`
- `test_a_figureless_render_reports_status_instead_of_a_number`
- `test_band_restriction_localises_the_change_to_the_head`
- `test_empty_mask_falls_back_to_whole_frame`
- `test_every_visual_pass_requires_banded_interior_difference`
- `test_identical_images_score_zero`
- `test_optimization_pass_is_not_asked_for_visual_evidence`
- `test_reports_sample_count_so_a_thin_band_cannot_pass_as_evidence`
- `test_returns_half_open_corners_not_origin_and_size`
- `test_silhouette_iou_is_blind_to_the_face_this_metric_resolves`
- `write_png`

---

## [img2threejs\forge\tests\test_issue_triage.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_issue_triage.py)

**Details:** Source code file.

**Functions / Classes:**
- `FakeIssueApi`
- `FakeResponse`
- `IssueTriageTests`
- `MarkerFailingApi`
- `MissingQueueLabelApi`
- `NoticeFailingApi`
- `__enter__`
- `__exit__`
- `__init__`
- `add_label`
- `create_notice`
- `get_issue`
- `has_notice_marker`
- `list_open_issues`
- `queue_label_exists`
- `read`
- `test_dry_run_reports_candidates_without_mutation`
- `test_empty_issue_list_has_an_empty_summary`
- `test_ignores_notice_marker_from_untrusted_commenter`
- `test_isolates_marker_lookup_failure`
- `test_marker_prevents_duplicate_notice`
- `test_missing_queue_label_fails_before_issue_mutation`
- `test_non_transient_github_errors_are_not_retried`
- `test_notices_unlabeled_open_issue_once`
- `test_partial_write_is_failed_and_recoverable`
- `test_rate_limit_is_retried_before_success`
- `test_reads_every_page_of_issue_comments_for_a_trusted_marker`
- `test_reads_every_page_of_open_issues`
- `test_rechecks_for_notice_before_retrying_ambiguous_comment_write`
- `test_recovers_labelled_issue_when_notice_is_missing`
- `test_scheduled_rollout_excludes_historical_issue`
- `test_skips_human_labelled_queue_issue_without_notice`
- `test_skips_pull_requests_and_type_labelled_issues`
- `test_trusted_bot_marker_prevents_duplicate_notice`

---

## [img2threejs\forge\tests\test_joint_admission_gate.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_joint_admission_gate.py)

**Details:** Source code file.

**Functions / Classes:**
- `JointAdmissionGate`
- `_bones`
- `_run`
- `_tags`
- `giant_femur`
- `reverse_forearm`
- `setUpClass`
- `skew_digit`
- `skew_right_arm`
- `test_monotonic_chain_accepts_a_thumb_at_right_angles_to_its_palm`
- `test_monotonic_chain_rejects_a_reversed_bone`
- `test_name_uniqueness_rejects_a_dangling_parent`
- `test_name_uniqueness_rejects_a_duplicate_id`
- `test_name_uniqueness_rejects_two_roots`
- `test_pivot_track_is_a_no_op`
- `test_pool_floor_rejects_a_skeleton_below_four_bones`
- `test_proportion_limit_rejects_an_oversized_bone`
- `test_symmetry_parity_handles_a_side_marker_in_the_middle_of_an_id`
- `test_symmetry_parity_snaps_instead_of_rejecting`
- `test_symmetry_tolerance_is_the_documented_value`
- `test_the_real_template_passes_every_check`

---

## [img2threejs\forge\tests\test_joint_loops.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_joint_loops.py)

**Details:** Source code file.

**Functions / Classes:**
- `GateBehaviour`
- `LoopCounting`
- `limb`
- `test_a_dense_two_ring_joint_still_fails`
- `test_a_sparse_five_ring_joint_passes`
- `test_failure_names_the_bone_and_says_what_happens`
- `test_loop_count_is_scale_invariant`
- `test_meshes_are_pooled_so_a_seam_joint_is_not_half_measured`
- `test_min_loops_is_configurable`
- `test_no_vertices_raises`
- `test_vertices_outside_the_radius_are_ignored`
- `test_zero_length_bone_is_reported_not_divided_by`

---

## [img2threejs\forge\tests\test_jpeg.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_jpeg.py)

**Details:** Source code file.

**Functions / Classes:**
- `JpegDecoderTest`
- `JpegPortabilityTest`
- `test_chroma_upsampling_places_the_colour_boundary_correctly`
- `test_decodes_correct_colours`
- `test_decodes_expected_dimensions`
- `test_every_load_image_reads_jpeg_without_sips`
- `test_is_jpeg_detects_signature`
- `test_progressive_raises_unsupported_not_garbage`
- `test_rejects_non_jpeg`

---

## [img2threejs\forge\tests\test_label_glb_nodes.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_label_glb_nodes.py)

**Details:** Source code file.

**Functions / Classes:**
- `CliGate`
- `HonestyAboutMergedShells`
- `ParentTransformsCompose`
- `RotationIsHandled`
- `SideDetection`
- `TwoNodeFigure`
- `_asset`
- `_box`
- `_glb`
- `_side_for`
- `setUp`
- `test_a_child_inherits_its_parent_translation`
- `test_a_node_on_the_axis_has_no_side`
- `test_a_node_spanning_most_of_the_figure_is_called_a_merged_shell`
- `test_a_non_glb_fails_with_exit_two`
- `test_a_rotated_node_uses_all_eight_corners`
- `test_bands_are_ordered_bottom_to_top`
- `test_every_node_carries_a_confidence_and_a_reason`
- `test_every_node_is_labelled`
- `test_figure_height_is_measured_not_assumed`
- `test_min_confidence_gates_a_weak_map`
- `test_names_are_recorded_but_never_used_as_evidence`
- `test_negative_x_is_the_characters_own_right`
- `test_positive_x_is_the_characters_own_left`
- `test_status_refuses_to_claim_confirmation`
- `test_the_bottom_node_bands_as_footwear_and_the_top_as_head`

---

## [img2threejs\forge\tests\test_material_physics.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_material_physics.py)

**Details:** Source code file.

**Functions / Classes:**
- `MaterialPhysicsGateTests`
- `OpenBoundarySideTests`
- `SheenEnergyTests`
- `SheenFoldingTests`
- `test_a_clean_fabric_material_passes`
- `test_a_garment_with_no_boundaries_is_not_checked`
- `test_a_non_garment_component_is_not_checked`
- `test_clearcoat_roughness_at_or_above_the_floor_is_silent`
- `test_clearcoat_roughness_below_the_floor_is_flagged`
- `test_closed_boundaries_do_not_require_double_side`
- `test_compensation_inverts_the_darkening`
- `test_compensation_is_a_no_op_when_sheen_is_off`
- `test_compensation_never_exceeds_one`
- `test_darkening_scales_with_effective_strength`
- `test_default_sheen_color_makes_sheen_a_no_op`
- `test_double_side_clears_it`
- `test_fabric_without_sheen_warns_it_has_no_woven_cue`
- `test_family_is_read_from_the_material_when_not_passed`
- `test_full_white_sheen_darkens_base_by_the_engine_coefficient`
- `test_ior_and_reflectivity_together_is_an_error`
- `test_non_skin_may_set_transmission`
- `test_open_garment_boundary_with_front_side_is_an_error`
- `test_sheen_and_sheen_color_are_one_degree_of_freedom`
- `test_sheen_off_is_zero_strength_whatever_the_colour`
- `test_sheen_with_black_sheen_color_is_an_error`
- `test_sheen_without_sheen_color_is_an_error_not_a_warning`
- `test_short_hex_is_expanded`
- `test_skin_may_not_set_thickness_either`
- `test_skin_may_not_set_transmission`
- `test_unparseable_colour_carries_no_sheen`
- `test_valid_sheen_warns_about_its_own_base_darkening`
- `test_zero_clearcoat_roughness_is_not_flagged`

---

## [img2threejs\forge\tests\test_material_pipeline.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_material_pipeline.py)

**Details:** Source code file.

**Functions / Classes:**
- `MaterialPipelineTest`
- `chunk`
- `setUp`
- `test_low_confidence_analysis_cannot_enter_without_override`
- `test_phase_one_resolver_preserves_authority_and_ambiguity`
- `test_phases_two_to_nine_vertical_slice`
- `test_unobserved_material_keeps_pipeline_probe_even_when_visible_regions_pass`
- `write_png`

---

## [img2threejs\forge\tests\test_material_reference.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_material_reference.py)

**Details:** Source code file.

**Functions / Classes:**
- `MaterialReferenceContract`
- `setUpClass`
- `test_core_material_families_are_covered`
- `test_critical_model_invariants`
- `test_deep_research_provenance_is_recorded`
- `test_every_recipe_is_explicitly_a_prior_with_image_cues`
- `test_library_is_versioned_and_targets_threejs`
- `test_material_ids_are_unique`
- `test_priors_stay_inside_documented_threejs_ranges`
- `test_source_references_resolve`
- `test_source_registry_is_traceable_and_unique`
- `test_specialist_materials_carry_specialist_sources`
- `test_texture_contract_separates_colour_and_data_maps`

---

## [img2threejs\forge\tests\test_module_cache.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_module_cache.py)

**Details:** Source code file.

**Functions / Classes:**
- `ModuleCacheTests`
- `setUp`
- `tearDown`
- `test_invalidate_attached_removes_dependents_only`
- `test_invalidate_returns_empty_when_no_dependents`
- `test_key_changes_with_generator_source`
- `test_key_changes_with_spec`
- `test_key_stable_regardless_of_dict_order`
- `test_put_get_roundtrip`

---

## [img2threejs\forge\tests\test_multi_angle.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_multi_angle.py)

**Details:** Source code file.

**Functions / Classes:**
- `MultiAngleTest`
- `_centered_block`
- `chunk`
- `fn`
- `setUp`
- `test_area_fraction_monotonic`
- `test_flat_plane_collapses_flagged`
- `test_vanished_edge_on_plane_flagged`
- `test_volumetric_object_not_flagged`
- `write_rgb_png`

---

## [img2threejs\forge\tests\test_objectness.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_objectness.py)

**Details:** Source code file.

**Functions / Classes:**
- `ObjectnessTest`
- `chunk`
- `diag_bar`
- `fn`
- `horiz_bar`
- `setUp`
- `test_identical_descriptor_cosine_is_one`
- `test_invariant_to_background_and_brightness`
- `test_score_bounded`
- `test_separates_different_shapes`
- `write_png`

---

## [img2threejs\forge\tests\test_optional_vision_tooling.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_optional_vision_tooling.py)

**Details:** Source code file.

**Functions / Classes:**
- `OptionalVisionToolingTests`
- `test_bridge_keeps_optional_runtime_outside_forge`
- `test_documentation_preserves_evidence_boundaries`
- `test_explicit_interpreter_override_is_resolved`
- `test_optional_environment_declares_all_three_vision_routes`

---

## [img2threejs\forge\tests\test_part_collision_morphs_lod.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_part_collision_morphs_lod.py)

**Details:** Source code file.

**Functions / Classes:**
- `Decimation`
- `InterPartPenetration`
- `MorphTargets`
- `box`
- `distance_to_joint`
- `setUpClass`
- `test_a_bar_driven_through_a_block_is_caught`
- `test_a_target_that_moves_nothing_is_flagged`
- `test_allowed_pairs_exempt_parts_meant_to_touch`
- `test_both_directions_are_checked`
- `test_corrective_pushes_the_surface_outward_near_the_joint_only`
- `test_decimated_mesh_is_still_a_closed_surface`
- `test_deltas_are_relative_and_mostly_zero`
- `test_each_mesh_alone_is_flawless_so_only_a_pair_test_can_see_this`
- `test_flip_refusals_are_counted_not_hidden`
- `test_generated_lod_plan_satisfies_the_validator_it_was_only_declared_for`
- `test_indices_stay_in_range_after_remapping`
- `test_invalid_ratio_raises`
- `test_mismatched_vertex_count_is_refused_not_truncated`
- `test_non_monotonic_request_is_refused`
- `test_point_inside_agrees_with_geometry`
- `test_ratio_of_one_is_a_no_op`
- `test_relative_flag_is_declared_because_absolute_would_collapse_the_mesh`
- `test_sampling_is_reported`
- `test_separated_parts_pass_and_say_the_test_actually_ran`
- `test_triangle_count_actually_drops`

---

## [img2threejs\forge\tests\test_per_feature.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_per_feature.py)

**Details:** Source code file.

**Functions / Classes:**
- `PerFeatureTests`
- `test_all_features_pass`
- `test_critical_below_fails_even_if_others_high`
- `test_missing_critical_feature_routes_refine_spec`
- `test_missing_from_scores_dict_treated_as_missing`
- `test_non_gating_below_threshold_does_not_fail`
- `test_threshold_defaults_per_tier`

---

## [img2threejs\forge\tests\test_pipeline.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_pipeline.py)

**Details:** Source code file.

**Functions / Classes:**
- `PipelineTest`
- `_fresh_spec`
- `chunk`
- `run`
- `setUp`
- `test_append_review_gate_and_record`
- `test_assessment_and_spec`
- `test_build_detail_inventory_slices_zones`
- `test_character_accessories_flag_restores_bust_traits`
- `test_character_autodetect_from_domain`
- `test_character_factory_generates`
- `test_character_flag_builds_humanoid_tree`
- `test_character_gate_requires_anatomy`
- `test_character_track_skipped_for_objects`
- `test_color_material_recipe_accepts_full_opacity_alpha_format`
- `test_comparison_sheet_packages_without_scoring`
- `test_cs2_anodized_finish_and_environment`
- `test_cs2_assessment_embeds_local_spec_search_results`
- `test_cs2_defaults_to_ultra_complex`
- `test_cs2_float_and_paint_seed_drive_wear_and_placement`
- `test_cs2_identity_precedence_flags_conflict`
- `test_cs2_intent_autodetected_from_target_name`
- `test_cs2_textures_gitignored_and_never_tracked`
- `test_cs2_track_skipped_for_objects`
- `test_cs2_view_dependent_finish_blocked_without_environment`
- `test_delight_reference_writes_png`
- `test_dense_component_enables_height_maps_when_shared_material_is_plain`
- `test_detail_inventory_backward_compatible`
- `test_detail_inventory_gate_fires_on_empty`
- `test_diagnose_render_tier1_help_and_identical_images`
- `test_digits_are_baseline_not_a_flag`
- `test_extract_cs2_textures_falls_back_without_vpk_or_binary`
- `test_extract_part_color_recipe_cache_hit_and_invalidation`
- `test_extract_part_color_recipe_patches_spec`
- `test_extrude_supports_oval_hole_via_shape_holes`
- `test_fetch_cs2_metadata_paint_index_disambiguates_identical_names`
- `test_fetch_cs2_metadata_resolves_and_flags_ambiguity`
- `test_flatness_pre_check_flags_thin_continuous_sculpt_extrude`
- `test_generate_factory_blocks_strict_quality_before_writing_output`
- `test_generate_factory_builds_curve_sweep`
- `test_generate_factory_builds_real_extrude_lathe_tube_geometry`
- `test_generate_factory_default_path_is_byte_stable`
- `test_generate_factory_emits_auto_framing`
- `test_generate_factory_emits_color_gradient_codegen`
- `test_generate_factory_emits_f3_f4_material_and_environment`
- `test_generate_factory_emits_presentation_composer_only`
- `test_generate_factory_emits_typescript`
- `test_generate_factory_emits_ws5_pbr_constraints_and_dense_maps`
- `test_generate_factory_omits_unused_geometry_helpers`
- `test_generic_assessment_uses_generic_spec_collection`
- `test_geometry_for_raises_for_unimplemented_primitive`
- `test_ground_blade_uv_uses_actual_y_bounds`
- `test_instanced_cluster_component_now_implemented`
- `test_locate_cs2_vpk_returns_not_found_when_absent`
- `test_new_schema_fields_present`
- `test_new_upgrade_scripts_help`
- `test_normal_validate_passes_strict_fails_on_shallow`
- `test_orchestrator_refuses_current_pass_without_passing_tier1`
- `test_orchestrator_starts_at_blockout`
- `test_pbr_extraction_runs`
- `test_probe_image`
- `test_repetition_system_emits_instanced_mesh`
- `test_topology_accepts_all_six_classes_with_allowed_primitives`
- `test_topology_rejects_disallowed_continuous_sculpt_pairing`
- `test_topology_rejects_disallowed_fiber_strand_pairing`
- `test_topology_rejects_missing_classification`
- `test_topology_rejects_restated_rationale`
- `write_png`

---

## [img2threejs\forge\tests\test_pipeline_routing.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_pipeline_routing.py)

**Details:** Source code file.

**Functions / Classes:**
- `PipelineRoutingTests`
- `classification`
- `test_ambiguous_or_low_confidence_classification_fails_closed`
- `test_assessment_and_spec_preserve_resolved_routing`
- `test_classification_routes_reliable_weapon_and_character`
- `test_conflicting_cs2_and_character_flags_do_not_select_a_template`
- `test_explicit_track_normalizes_to_routing_metadata`
- `test_explicit_track_rejects_reliable_contradiction`
- `test_legacy_cs2_does_not_override_an_explicit_character_track`
- `test_legacy_cs2_intake_derives_valid_routing_without_persisting_it`
- `test_legacy_cs2_routes_weapon_without_modern_classification`
- `test_malformed_classification_fails_closed`
- `test_validator_accepts_resolved_and_rejects_malformed_contract`
- `test_validator_rejects_unresolved_or_wrong_template_routing`
- `test_weapon_and_character_routing_select_their_own_templates`

---

## [img2threejs\forge\tests\test_primitive_watertightness.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_primitive_watertightness.py)

**Details:** Source code file.

**Functions / Classes:**
- `PrimitiveWatertightnessTest`
- `_ground_blade_descriptor`
- `build_probe_spec`
- `compile_generated_module`
- `import_forge_modules`
- `setUpClass`
- `tearDownClass`
- `test_capsule_is_watertight_even_without_welding`
- `test_closed_solids_are_watertight_under_true_topology`
- `test_every_valid_primitive_was_measured`
- `test_known_unfixed_defects_are_pinned_not_worse`
- `test_open_by_design_primitives_have_a_real_boundary`

---

## [img2threejs\forge\tests\test_recessed_and_open_shell_topology.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_recessed_and_open_shell_topology.py)

**Details:** Source code file.

**Functions / Classes:**
- `OpenShellTopologyTest`
- `RecessedFeatureGateTest`
- `RegressionSafetyTest`
- `_implicit_eye_cavity`
- `base_spec`
- `import_forge_modules`
- `load_fixture`
- `test_bare_socket_attachment_point_is_not_treated_as_recessed`
- `test_correctly_authored_open_shell_is_accepted`
- `test_correctly_authored_socket_via_implicit_subtract_is_accepted`
- `test_dimple_is_no_longer_a_recessed_feature_token`
- `test_double_sided_must_be_boolean`
- `test_hollow_and_concave_in_role_do_fire`
- `test_hollow_and_concave_scoped_to_role_do_not_false_positive_on_name`
- `test_implicit_character_torso_limb_fixture_still_validates_clean`
- `test_implicit_recessed_feature_missing_sdf_defers_to_the_existing_implicit_check`
- `test_implicit_recessed_feature_with_subtract_present_alongside_other_ops_is_accepted`
- `test_mutation_assembled_solid_convex_sphere_recessed_feature_is_rejected`
- `test_mutation_attachment_socket_component_is_not_rejected_by_rule_1`
- `test_mutation_flat_plane_card_eye_is_rejected_even_without_surface_relief_class`
- `test_mutation_flat_surface_relief_eye_socket_is_rejected`
- `test_mutation_implicit_recessed_feature_without_subtract_is_rejected`
- `test_mutation_open_shell_paired_with_closed_sdf_is_rejected`
- `test_mutation_open_shell_without_double_sided_material_is_rejected`
- `test_non_recessed_component_is_unaffected`
- `test_open_shell_is_a_valid_topology_class`
- `test_real_character_template_eye_cavity_output_is_accepted`
- `test_role_name_id_tokens_are_detected`
- `test_shallow_relief_panel_without_a_cavity_token_is_accepted`
- `wing_component`

---

## [img2threejs\forge\tests\test_reference_admission.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_reference_admission.py)

**Details:** Source code file.

**Functions / Classes:**
- `ImageHashTest`
- `ReferenceAdmissionTest`
- `_centered_block`
- `_split_image`
- `chunk`
- `fn`
- `setUp`
- `test_admits_coherent_centered_subject`
- `test_brightness_shift_barely_changes_hash`
- `test_different_structure_differs_substantially`
- `test_identical_hamming_zero`
- `test_largest_component_fraction_math`
- `test_rejects_duplicate`
- `test_rejects_fragmented_mask`
- `test_rejects_no_isolable_subject`
- `test_rejects_tiny_resolution`
- `test_rejects_undecodable_cleanly`
- `write_rgb_png`

---

## [img2threejs\forge\tests\test_reference_effects.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_reference_effects.py)

**Details:** Source code file.

**Functions / Classes:**
- `ReferenceEffectTests`
- `_flat_gray`
- `_glow`
- `_shallow_dof`
- `_sharp_scene`
- `chunk`
- `setUp`
- `test_glow_flagged`
- `test_no_glow_on_flat_image`
- `test_recommend_effects_shape`
- `test_shallow_dof_flagged`
- `test_sharp_scene_no_blur`
- `write_rgb_png`

---

## [img2threejs\forge\tests\test_region_and_arc_gates.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_region_and_arc_gates.py)

**Details:** Source code file.

**Functions / Classes:**
- `SweptArcGate`
- `VertexRegionGate`
- `_points`
- `_rgb`
- `arc_tube`
- `straight_cone`
- `test_a_hook_of_the_wrong_radius_fails_the_radius_check_and_not_the_span`
- `test_a_hook_of_the_wrong_thickness_fails_the_tube_check`
- `test_a_hook_recovers_the_radius_span_and_tube_it_was_built_with`
- `test_a_matching_expectation_passes`
- `test_a_real_hook_reports_a_determined_plane`
- `test_a_region_with_no_vertices_is_reported_missing_rather_than_passing`
- `test_a_scoped_measurement_ignores_the_same_colour_on_another_mesh`
- `test_a_short_sweep_of_a_thick_tube_reports_an_undetermined_plane`
- `test_a_spatial_filter_matching_nothing_is_missing_not_a_pass`
- `test_a_spatial_filter_picks_the_blob_by_where_it_is_not_by_its_rank`
- `test_a_straight_tapered_cone_fails_the_same_gate`
- `test_a_thin_shallow_arc_fails_the_span_requirement`
- `test_an_empty_scope_is_an_error_rather_than_an_empty_pass`
- `test_an_expectation_outside_tolerance_fails_and_names_the_delta`
- `test_azimuth_rotates_what_is_measured`
- `test_cli_exits_one_on_a_failed_expectation_and_zero_on_a_met_one`
- `test_cli_reports_a_cone_failure_with_a_nonzero_exit`
- `test_moving_the_boundary_moves_the_measurement`
- `test_naming_a_blob_that_does_not_exist_is_missing_not_a_silent_whole_region`
- `test_one_colour_in_two_places_splits_into_two_blobs`
- `test_selecting_a_blob_measures_that_blob_and_not_the_other`
- `test_the_fit_reports_which_plane_it_used_and_how_far_off_it_the_points_are`
- `test_the_measured_boundary_matches_the_height_it_was_built_at`
- `test_unpaintable_vertices_are_counted_not_absorbed`
- `two_patches`
- `two_tone_box`

---

## [img2threejs\forge\tests\test_release_metadata.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_release_metadata.py)

**Details:** Source code file.

**Functions / Classes:**
- `ReleaseMetadataTests`
- `run_release`
- `test_dry_run_reports_the_next_version_without_writing_metadata`
- `test_minor_release_synchronizes_all_version_metadata`
- `test_non_releasable_commits_leave_metadata_unchanged`
- `write_project`

---

## [img2threejs\forge\tests\test_render_bridge.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_render_bridge.py)

**Details:** Source code file.

**Functions / Classes:**
- `RenderBridgeTest`
- `chunk`
- `test_init_emits_required_camera_batch`
- `test_record_and_validate_preserve_screenshot_hash`
- `test_validate_detects_changed_reference`
- `write_png`

---

## [img2threejs\forge\tests\test_render_profile.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_render_profile.py)

**Details:** Source code file.

**Functions / Classes:**
- `RenderProfileTest`
- `test_example_profile_passes`
- `test_profile_accepts_subject_specific_regions`
- `test_profile_rejects_duplicate_region_id`
- `test_profile_rejects_empty_required_region_contract`
- `test_profile_rejects_missing_declared_subject_region`
- `test_profile_rejects_missing_pass`
- `test_profile_rejects_wrong_color_space`

---

## [img2threejs\forge\tests\test_repetition_system_scale.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_repetition_system_scale.py)

**Details:** Source code file.

**Functions / Classes:**
- `RepetitionSystemScaleTest`
- `compile_generated_module`
- `import_forge_modules`
- `setUpClass`
- `tearDownClass`
- `test_cluster_found_all_instances_present`
- `test_host_pivot_scale_is_identity`
- `test_instance_world_scale_equals_instance_scale_not_host_scale`
- `test_radial_ring_stays_circular_under_a_nonuniform_host`

---

## [img2threejs\forge\tests\test_rigid_hair_binding.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_rigid_hair_binding.py)

**Details:** Source code file.

**Functions / Classes:**
- `BindActuallyExcludes`
- `BindReportsThePartition`
- `TheHazardIsReal`
- `ThePartition`
- `column`
- `hair_vertices`
- `head_on_neck_with_hair`
- `mesh_with_owners`
- `test_a_joint_that_is_not_among_the_bones_is_reported`
- `test_a_lock_rides_the_first_SKINNED_ancestor_not_its_immediate_parent`
- `test_a_parent_cycle_terminates`
- `test_a_tree_with_no_rigid_roles_produces_no_warning`
- `test_all_four_rigid_roles_are_excluded`
- `test_an_orphan_rigid_component_warns`
- `test_bind_carries_the_partition_when_given_components`
- `test_bind_names_the_rigid_components_it_found`
- `test_bind_without_components_behaves_exactly_as_before`
- `test_components_without_ids_are_skipped_not_crashed_on`
- `test_every_influence_slot_is_accounted_for`
- `test_hair_is_excluded_and_reported_not_dropped`
- `test_rigid_vertices_ride_their_joint_at_full_weight`
- `test_role_matching_is_case_insensitive`
- `test_skinned_vertices_are_untouched`
- `test_the_count_of_pinned_vertices_is_reported`
- `test_the_neck_bone_reaches_the_crown_through_the_skull`
- `test_the_neck_loses_its_grip_on_the_crown_entirely`
- `test_the_role_set_is_overridable`
- `test_weights_still_sum_to_one_after_pinning`
- `test_without_vertexComponents_the_exclusion_says_it_could_not_run`
- `weight_of`

---

## [img2threejs\forge\tests\test_rig_hierarchy_emission.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_rig_hierarchy_emission.py)

**Details:** Source code file.

**Functions / Classes:**
- `RigHierarchyEmission`
- `raw_geometry`
- `setUpClass`
- `test_attachment_limbs_receive_their_authored_rotation`
- `test_bone_rotation_deforms_its_own_mesh_and_not_a_distant_one`
- `test_bone_world_positions_round_trip_to_the_spec_joints`
- `test_bones_are_emitted_parents_first`
- `test_character_spec_is_on_the_bone_track`
- `test_exactly_one_weight_function_is_emitted`
- `test_pivot_track_emits_no_rig`
- `test_skin_weights_are_normalised_and_in_range_on_executed_geometry`
- `test_the_bake_is_pose_independent`

---

## [img2threejs\forge\tests\test_rig_milestone0.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_rig_milestone0.py)

**Details:** Source code file.

**Functions / Classes:**
- `AxisExemptionSelfCheck`
- `RigMilestone0`
- `_assert_matches_analytic_chord_length`
- `_case`
- `build_three_bone_arm_spec`
- `resolve_gate`
- `setUpClass`
- `tearDownClass`
- `test_gate_a_weight_normalization`
- `test_gate_b_deformation_delta`
- `test_gate_c_envelope_containment`
- `test_gate_d_boundary_edges`
- `test_on_axis_offset_along_axis_is_exempt`
- `test_on_axis_vertex_is_exempt_with_zero_displacement`
- `test_vertex_inside_epsilon_is_exempt`
- `test_vertex_outside_epsilon_is_not_exempt_and_moves`

---

## [img2threejs\forge\tests\test_scalp_exposure.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_scalp_exposure.py)

**Details:** Source code file.

**Functions / Classes:**
- `AreaWeighting`
- `BaldStrips`
- `Contract`
- `ExposedRuns`
- `FullCoverage`
- `TheCapDisc`
- `TheFailureIsRealInPixels`
- `TheRecordedFailure`
- `crown_light_fraction`
- `shell`
- `test_a_band_that_stops_below_the_crown_does_not_sample_the_cap`
- `test_a_bare_cap_is_now_found`
- `test_a_bare_crown_cap_is_found`
- `test_a_covered_cap_reports_nothing`
- `test_a_degenerate_band_is_rejected`
- `test_a_fully_exposed_ring_reports_the_whole_ring`
- `test_a_partial_run_is_still_measured_as_a_run`
- `test_a_partial_sink_exposes_only_the_sunk_region`
- `test_a_skull_fully_wrapped_reports_nothing_exposed`
- `test_a_strip_is_found_and_its_area_is_about_right`
- `test_a_strip_reads_as_a_run_and_scattered_holes_do_not`
- `test_hair_beyond_reach_does_not_count_as_coverage`
- `test_hair_that_sank_into_the_skull_is_not_coverage`
- `test_no_hair_at_all_reports_everything_exposed`
- `test_non_positive_reach_is_rejected`
- `test_the_cap_samples_are_labelled_so_a_caller_can_tell_where`
- `test_the_fraction_is_area_weighted_not_sample_counted`
- `test_the_report_counts_what_it_discarded`
- `test_the_strip_is_reported_where_it_actually_is`
- `test_the_uncalibrated_threshold_is_declared_as_such`
- `test_widening_the_side_masses_raised_scalp_exposure_on_every_view`

---

## [img2threejs\forge\tests\test_scalp_field.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_scalp_field.py)

**Details:** Source code file.

**Functions / Classes:**
- `Caps`
- `EstimateErrsSafely`
- `FromComponent`
- `Normals`
- `SignIsExact`
- `SurfaceSamples`
- `Validation`
- `test_a_band_that_stops_short_has_no_cap`
- `test_a_corner_combines_both_gaps`
- `test_a_cylinder_normal_is_radial`
- `test_a_degenerate_band_is_rejected`
- `test_a_mismatched_offset_array_is_an_error_not_a_silent_truncation`
- `test_a_surface_sample_reads_zero`
- `test_a_tapering_stack_tilts_its_normal_upward`
- `test_above_the_stack_is_outside`
- `test_an_elliptical_section_is_not_treated_as_a_circle`
- `test_axis_is_inside`
- `test_below_the_stack_is_outside`
- `test_degenerate_sample_counts_are_rejected`
- `test_duplicate_heights_are_rejected`
- `test_every_band_sample_lies_on_the_surface`
- `test_far_outside_is_positive`
- `test_inside_the_estimate_never_understates_depth`
- `test_mapping_and_tuple_forms_agree`
- `test_missing_descriptor_shapes_raise`
- `test_non_finite_values_are_rejected`
- `test_normals_are_unit_length`
- `test_normals_point_outward`
- `test_nothing_returns_nan`
- `test_one_ring_is_rejected`
- `test_outside_the_estimate_never_overstates_clearance`
- `test_rings_are_sorted_not_assumed_sorted`
- `test_samples_carry_area_weight_not_count`
- `test_sign_flips_exactly_at_the_surface`
- `test_the_axial_gap_is_the_distance_above_the_cap`
- `test_the_band_range_is_honoured`
- `test_the_cap_carries_the_disc_area`
- `test_the_cap_disc_is_sampled`
- `test_the_estimate_converges_at_the_surface`
- `test_the_parallel_offset_array_form_is_accepted`
- `test_the_z_offset_moves_the_section`
- `test_wrong_arity_is_rejected`
- `test_zero_or_negative_radius_is_rejected`

---

## [img2threejs\forge\tests\test_sdf_primitives.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_sdf_primitives.py)

**Details:** Source code file.

**Functions / Classes:**
- `ImplicitSurfaceIsSmooth`
- `SdfPrimitiveContractTest`
- `_mesh`
- `import_forge_modules`
- `load_fixture`
- `test_a_surface_reaching_its_sampling_bounds_emits_no_stray_index`
- `test_accepts_implicit_topology_with_maximum_sdf_resolution`
- `test_generates_inverse_quaternion_for_multi_axis_sdf_rotation`
- `test_generates_sdf_and_polygonizer_markers`
- `test_normals_point_outward_and_are_unit_length`
- `test_rejects_collapsed_or_reversed_sdf_bounds`
- `test_rejects_conflicting_sdf_operation_id_and_output`
- `test_rejects_invalid_sdf_primitive_operation_resolution_and_nonfinite_values`
- `test_rejects_sdf_descriptor_cardinality_over_limits`
- `test_rejects_sdf_operation_output_id_collisions`
- `test_rejects_unsupported_sdf_operation_fields`
- `test_rejects_unsupported_sdf_primitive_fields`
- `test_rejects_unsupported_sdf_transform_fields`
- `test_the_recovered_surface_is_close_to_the_sphere_it_was_sampled_from`
- `test_the_surface_encloses_a_positive_volume`
- `test_vertices_do_not_sit_on_the_sampling_grid_planes`

---

## [img2threejs\forge\tests\test_search_specs.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_search_specs.py)

**Details:** Source code file.

**Functions / Classes:**
- `BM25Test`
- `CacheLifecycleTest`
- `CliOutputTest`
- `DistilledRecordTest`
- `RecordContractTest`
- `SnippetTest`
- `SourceIngestionTest`
- `SpecRecordValidationError`
- `TokenizerTest`
- `__init__`
- `_assert_unsafe_profile_cache_path`
- `load_contract_fixture`
- `make_profile`
- `make_record`
- `run_cli_fixture`
- `test_absolute_profile_cache_path_returns_cache_failure_without_disclosure_or_write`
- `test_atomic_write_failure_cleans_temp_and_preserves_old_cache`
- `test_cache_hit_avoids_source_reparse_and_preserves_fingerprint`
- `test_cache_path_rejects_traversal_and_absolute_values_before_write`
- `test_clean_style_project_searches_committed_distilled_records_without_raw_roots`
- `test_config_tokenizer_and_schema_changes_each_rebuild`
- `test_corrupt_json_rebuilds_when_sources_are_available`
- `test_cs2_record_round_trips_with_bilingual_aliases_and_provenance`
- `test_enabled_term_alias_query_matches_expansion_and_disabled_does_not`
- `test_equal_scores_tie_by_record_id_ascending`
- `test_existing_unreadable_optional_root_raises_typed_source_error`
- `test_force_reindex_rebuilds_unchanged_cache`
- `test_future_jsonl_loader_api_is_documented`
- `test_hidden_directories_and_generated_caches_are_excluded`
- `test_human_output_is_nonempty_and_stable_on_cache_hits`
- `test_json_output_has_stable_machine_consumed_shape`
- `test_malformed_configured_json_and_jsonl_raise_named_errors`
- `test_malformed_jsonl_raises_named_validation_error_instead_of_skipping`
- `test_markdown_sections_retain_heading_and_source_path`
- `test_missing_optional_root_is_skipped_but_required_root_is_not`
- `test_mixed_language_tokens_preserve_identifiers_numbers_and_accents`
- `test_nested_json_values_retain_key_path_and_source_path`
- `test_no_match_is_success_with_empty_matches`
- `test_notebooklm_evidence_refs_survive_cache_hit_and_cli_serialization`
- `test_profile_alias_expansion_is_deterministic`
- `test_profile_casefold_setting_changes_index_and_query_tokens`
- `test_profile_loader_exposes_cs2_cache_and_documentation`
- `test_profile_loader_rejects_malformed_and_unknown_collections`
- `test_rare_exact_terms_beat_longer_generic_document`
- `test_reviewed_bilingual_records_are_complete_and_source_backed`
- `test_snippet_is_bounded_centered_and_word_trimmed`
- `test_source_mutation_rebuilds_stale_cache`
- `test_symlink_source_file_is_rejected_without_indexing_target`
- `test_symlink_source_root_is_rejected_without_indexing_target`
- `test_symlinked_cache_parent_returns_structured_cache_failure`
- `test_traversal_profile_cache_path_returns_cache_failure_without_disclosure_or_write`
- `test_undersized_snippets_are_rejected_before_search`
- `test_untruncated_snippet_has_no_ellipses`
- `test_validation_and_profile_errors_have_documented_codes`
- `unreadable_iterdir`
- `validate_evidence_refs`
- `validate_measurements`
- `validate_record`
- `validate_source_refs`
- `validate_string_array`
- `write_cli_fixture`
- `write_fixture_source`
- `write_jsonl`

---

## [img2threejs\forge\tests\test_self_intersection.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_self_intersection.py)

**Details:** Source code file.

**Functions / Classes:**
- `CleanMesh`
- `CommandLine`
- `DegenerateInput`
- `IndexEncodings`
- `ParityIsReal`
- `Performance`
- `SamplingHonesty`
- `SelfIntersectionRegression`
- `_expect_error`
- `_run`
- `_write`
- `icosphere`
- `midpoint`
- `punch_through`
- `setUpClass`
- `test_aggregate_reports_the_offending_mesh`
- `test_bad_mesh_exits_two`
- `test_both_encodings_catch_the_defect`
- `test_budget_exceeded_reports_a_real_stride`
- `test_centroid_fallback_is_reported_when_normals_absent`
- `test_clean_mesh_exits_zero`
- `test_closed_convex_mesh_is_clean`
- `test_empty_indices`
- `test_empty_vertices`
- `test_epsilon_scales_with_the_model`
- `test_every_vertex_gets_broad_phase_candidates`
- `test_five_thousand_triangle_mesh_is_usable`
- `test_flat_and_grouped_indices_agree`
- `test_full_coverage_is_reported_as_stride_one`
- `test_grouped_indices_with_a_short_group`
- `test_index_count_not_a_multiple_of_three`
- `test_index_out_of_range`
- `test_inverted_normals_put_every_sample_inside`
- `test_json_flag_emits_parseable_output`
- `test_max_samples_flag_is_honoured`
- `test_missing_file_exits_two`
- `test_missing_indices`
- `test_missing_vertices`
- `test_non_dict_mesh_entry_does_not_abort_the_batch`
- `test_sampling_is_deterministic`
- `test_self_intersecting_mesh_exits_one`
- `test_supplied_normals_are_used_and_reported`
- `test_surface_pushed_through_the_far_side_is_caught`
- `test_topology_gate_passes_the_mesh_this_gate_rejects`
- `test_two_dimensional_vertex`
- `test_unusable_payload_exits_two`
- `test_wrong_length_normals_fall_back_rather_than_trusting_them`
- `test_zero_extent_mesh`

---

## [img2threejs\forge\tests\test_showcase_tsc_smoke.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_showcase_tsc_smoke.py)

**Details:** Source code file.

**Functions / Classes:**
- `ShowcaseTscSmokeTest`
- `_generate_primitive_only_factory`
- `_run_tsc`
- `run`
- `setUp`
- `test_implicit_sdf_factory_typechecks_and_is_removed`
- `test_showcase_smoke_source_is_removed_after_tsc_success_and_failure`
- `test_visual_hull_factory_typechecks_and_is_removed`

---

## [img2threejs\forge\tests\test_specular_wash.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_specular_wash.py)

**Details:** Source code file.

**Functions / Classes:**
- `SpecularWashTest`
- `_solid`
- `chunk`
- `fn`
- `setUp`
- `test_matched_render_not_flagged`
- `test_washed_render_flagged`
- `write_rgb_png`

---

## [img2threejs\forge\tests\test_stand_proud.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_stand_proud.py)

**Details:** Source code file.

**Functions / Classes:**
- `Accepted`
- `HardErrors`
- `MissingIsWarnedNotIgnored`
- `ReferenceResolution`
- `proud`
- `run`
- `test_a_bad_clearance_short_circuits_before_the_maxPush_comparison`
- `test_a_forward_reference_is_legal`
- `test_a_hair_component_without_it_warns`
- `test_a_missing_target_is_an_error`
- `test_a_non_hair_component_may_also_declare_it`
- `test_a_non_hair_component_without_it_is_silent`
- `test_a_non_object_declaration_is_an_error`
- `test_a_non_positive_clearance_is_an_error`
- `test_a_non_positive_maxPush_is_an_error`
- `test_a_well_formed_declaration_passes_and_records_its_reference`
- `test_an_unknown_target_is_caught_by_the_spec_level_pass`
- `test_maxPush_below_clearance_is_an_error`
- `test_maxPush_equal_to_clearance_is_allowed`
- `test_standing_proud_of_itself_is_an_error`
- `test_the_expected_role_set_is_exported_so_the_rule_is_inspectable`

---

## [img2threejs\forge\tests\test_stand_proud_emission.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_stand_proud_emission.py)

**Details:** Source code file.

**Functions / Classes:**
- `EmittedSourceTypechecks`
- `ForwardReference`
- `HelperEmission`
- `RingStackDerivation`
- `SaturationIsReported`
- `ThePortsAgree`
- `TheStackDescribesTheRealSurface`
- `UnresolvableDeclarations`
- `emitted_rings`
- `spec`
- `test_a_component_may_stand_proud_of_one_declared_after_it`
- `test_a_factory_using_standProud_typechecks`
- `test_a_lathe_target_with_an_elliptical_stack_is_refused`
- `test_a_malformed_declaration_never_reaches_the_generator`
- `test_a_shape_with_no_describable_surface_returns_none`
- `test_a_target_whose_shape_has_no_ring_stack_is_reported_in_the_output`
- `test_a_target_with_no_dimensions_is_left_at_unit_scale`
- `test_a_vertex_on_the_axis_marches_axially_instead_of_being_skipped`
- `test_a_warning_names_the_consequence_and_the_fix`
- `test_an_authored_ring_stack_is_used_directly`
- `test_an_authored_stack_is_scaled_to_the_geometry_it_describes`
- `test_an_ellipsoid_is_synthesised_at_unit_scale`
- `test_an_ellipsoid_target_reports_its_real_half_extent_not_0_5`
- `test_an_explicit_transform_scale_wins_over_dimensions`
- `test_normals_are_recomputed_after_moving_vertices`
- `test_nothing_is_emitted_when_no_component_declares_it`
- `test_parallel_z_offsets_are_merged`
- `test_the_count_is_left_on_the_geometry_for_a_gate_to_read`
- `test_the_declared_numbers_reach_the_call`
- `test_the_fixture_carries_both_a_ring_stack_target_and_two_marchers`
- `test_the_fixture_ring_stack_matches_the_geometry_it_claims_to_describe`
- `test_the_helper_and_the_call_are_both_emitted`
- `test_the_march_runs_in_the_target_frame`
- `test_the_march_travels_along_the_vertex_spoke`
- `test_the_stack_height_is_scaled_too`
- `test_the_transliteration_matches_the_emitted_source`
- `test_the_two_implementations_agree_across_the_domain`
- `test_the_z_offset_is_scaled_by_depth_not_by_width`
- `test_they_agree_on_the_signs_too`
- `test_travel_is_capped_at_maxPush`
- `test_unresolved_vertices_are_counted`
- `ts_ring_stack_distance`

---

## [img2threejs\forge\tests\test_structure_gates.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_structure_gates.py)

**Details:** Source code file.

**Functions / Classes:**
- `SelfIntersectionWiring`
- `StructureGateTest`
- `_payload`
- `setUpClass`
- `test_clean_mesh_does_not_trip_the_new_failure`
- `test_coincident_vertices_are_merged_for_edge_counts`
- `test_inconsistent_normals_are_reported`
- `test_non_manifold_edges_are_severity_tagged`
- `test_open_integrated_geometry_is_also_watertight_error`
- `test_open_separate_geometry_fails_and_map_only_is_reported`
- `test_out_of_order_append_leaves_spec_unchanged`
- `test_punched_through_mesh_fails_the_integrity_gate`
- `test_sync_disagreement_names_uncredited_review`
- `test_triangle_budget_accepts_lod_tiers_with_reduction`
- `test_triangle_budget_rejects_lod_tiers_without_reduction`
- `test_triangle_budget_requires_lod_and_is_severity_tagged`
- `test_zero_length_normals_are_reported`

---

## [img2threejs\forge\tests\test_subdivision.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_subdivision.py)

**Details:** Source code file.

**Functions / Classes:**
- `SubdivisionContractTest`
- `compile_generated_module`
- `import_forge_modules`
- `load_fixture`
- `load_implicit_fixture`
- `test_accepts_empty_subdivide_as_a_no_op`
- `test_accepts_opt_in_subdivision_iterations`
- `test_default_instanced_cluster_subdivision_uses_closed_box_source`
- `test_generate_rejects_invalid_subdivision_iterations`
- `test_generated_cage_reports_runtime_quad_growth`
- `test_generated_cylinder_and_cone_subdivision_execute_safely`
- `test_generated_subdivision_propagates_uv2`
- `test_generated_subdivision_rejects_dense_geometry_over_budget`
- `test_generated_subdivision_rejects_disconnected_incident_face_fans`
- `test_generated_subdivision_rejects_invalid_runtime_iterations`
- `test_generated_subdivision_rejects_non_manifold_edges`
- `test_generated_subdivision_rejects_open_boundary_topology`
- `test_generates_catmull_clark_helper_and_recomputes_normals`
- `test_generator_cli_rejects_invalid_subdivision_iterations`
- `test_non_subdivided_cone_preserves_cone_geometry_output`
- `test_plane_card_subdivision_is_rejected_before_generation`
- `test_primitive_only_factory_omits_subdivision_helper`
- `test_rejects_attached_box_subdivision_over_attachment_cylinder_budget`
- `test_rejects_dense_primitive_subdivision_before_generation`
- `test_rejects_negative_fractional_and_over_limit_iterations`
- `test_static_budget_allows_runtime_safe_cylinder_and_cone_subdivision`
- `test_subdivision_preflight_covers_all_generator_paths`
- `test_torus_subdivision_is_rejected_before_generation`

---

## [img2threejs\forge\tests\test_tapered_sweep.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_tapered_sweep.py)

**Details:** Source code file.

**Functions / Classes:**
- `DefaultDescriptor`
- `EmittedSource`
- `PrimitiveRegistration`
- `SweepWindingFacesOutward`
- `TaperRiskIsDirectionAgnostic`
- `TaperWarning`
- `_build`
- `_component`
- `_signed_volume`
- `_sweep_spec`
- `component`
- `source`
- `station`
- `test_a_barrel_widest_in_the_middle_is_not_called_a_noodle`
- `test_a_collapsed_station_emits_one_vertex_not_a_zero_radius_ring`
- `test_a_constant_radius_sweep_is_caught`
- `test_a_curved_sweep_encloses_a_positive_volume`
- `test_a_genuinely_untapered_sweep_still_warns_in_both_orders`
- `test_a_lock_that_reaches_a_point_passes`
- `test_a_missing_descriptor_falls_back_to_a_tapering_default`
- `test_a_point_end_is_not_capped_again`
- `test_a_straight_sweep_encloses_a_positive_volume`
- `test_a_sweep_ending_in_a_point_also_encloses_a_positive_volume`
- `test_components_without_the_descriptor_are_untouched`
- `test_geometry_for_emits_the_builder`
- `test_guards_coincident_stations`
- `test_guards_the_degenerate_seed_axis`
- `test_malformed_stations_do_not_raise`
- `test_primitive_is_accepted_by_the_schema`
- `test_recomputes_normals_after_building`
- `test_the_builder_is_emitted_and_called`
- `test_the_default_passes_its_own_taper_gate`
- `test_the_default_tip_is_a_true_point`
- `test_the_recovered_blunt_lock_is_caught`
- `test_the_same_limb_scores_the_same_either_way_round`
- `test_uses_parallel_transport_not_frenet`

---

## [img2threejs\forge\tests\test_tessellation_tiers.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_tessellation_tiers.py)

**Details:** Source code file.

**Functions / Classes:**
- `EmittedGeometryTest`
- `FlatShadingTest`
- `SdfResolutionCapTest`
- `TierFloorTest`
- `TierSelectionTest`
- `_capped`
- `_emit`
- `_generated`
- `test_a_descriptor_without_a_resolution_is_returned_unchanged`
- `test_a_grid_already_below_the_ceiling_is_left_alone`
- `test_a_tier_below_the_joint_floor_is_refused`
- `test_a_tier_below_the_radial_floor_is_refused`
- `test_absent_or_unusable_budget_keeps_the_pre_tier_behaviour`
- `test_budget_maps_to_a_coarser_tier`
- `test_cone_height_segments_is_pinned_out_of_the_budget_knobs`
- `test_default_argument_reproduces_the_hero_string`
- `test_every_shipped_tier_clears_the_deformation_floors`
- `test_every_tier_declares_a_ceiling`
- `test_flat_shading_defaults_to_off`
- `test_flat_shading_is_emitted_and_reads_from_the_material_spec`
- `test_hero_tier_is_the_module_constants`
- `test_low_tier_emits_coarser_primitives_than_hero`
- `test_low_tier_lowers_a_grid_above_its_ceiling`
- `test_the_joint_floor_matches_the_in_repo_precedent_not_the_textbook`
- `test_unknown_tier_is_refused`

---

## [img2threejs\forge\tests\test_textureless_material.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_textureless_material.py)

**Details:** Source code file.

**Functions / Classes:**
- `Declaration`
- `EmittedFactory`
- `QualityBar`
- `_minimal_spec`
- `base_material`
- `quality_first_spec`
- `test_a_declaration_with_evidence_is_accepted`
- `test_a_declaration_without_evidence_is_rejected`
- `test_a_declared_material_is_exempt_from_the_texture_channel_bar`
- `test_a_material_cannot_be_textureless_and_carry_a_texture_field`
- `test_a_material_without_the_declaration_still_gets_its_texture_set`
- `test_absent_declaration_changes_nothing`
- `test_an_empty_evidence_list_is_rejected`
- `test_an_undeclared_material_still_fails_the_texture_channel_bar`
- `test_declared_false_is_rejected_rather_than_treated_as_absent`
- `test_the_declaration_is_hard_validated_through_validate_materials`
- `test_the_emitted_material_skips_texture_synthesis_when_declared`
- `test_the_exemption_is_per_material_not_global`

---

## [img2threejs\forge\tests\test_tier1_diagnostics.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_tier1_diagnostics.py)

**Details:** Source code file.

**Functions / Classes:**
- `BboxOfTest`
- `ColorGateByPassTest`
- `MaskIsRobustToStrayForeground`
- `ProportionDeltaTest`
- `SilhouetteIouTest`
- `SymmetryErrorTest`
- `_mask`
- `make_mask`
- `test_a_clean_mask_is_returned_unchanged`
- `test_a_stray_cell_is_dropped_from_the_bounding_box`
- `test_an_empty_mask_does_not_divide_by_zero`
- `test_axis_scaled_bbox_has_known_aspect_ratio_delta`
- `test_bbox_matches_known_foreground_region`
- `test_discarded_geometry_is_reported_rather_than_swallowed`
- `test_disjoint_masks_give_iou_zero`
- `test_identical_bboxes_have_zero_deltas`
- `test_identical_masks_give_iou_one`
- `test_known_overlap_fraction`
- `test_material_pass_and_later_are_color_gated`
- `test_maximally_asymmetric_mask_has_error_one`
- `test_perfectly_symmetric_mask_has_zero_error`
- `test_pre_material_passes_are_not_color_gated`
- `test_unknown_or_missing_pass_is_not_gated`

---

## [img2threejs\forge\tests\test_turntable_gate.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_turntable_gate.py)

**Details:** Source code file.

**Functions / Classes:**
- `TurntableGateTest`
- `_blob`
- `_low_contrast_gradient`
- `_write`
- `chunk`
- `fn`
- `setUp`
- `test_allow_holes_does_not_excuse_an_unsegmentable_capture`
- `test_allow_holes_flips_holed_case_back_to_passing`
- `test_missing_azimuths_reported_and_fails`
- `test_punched_disc_is_holed_and_fails_while_area_barely_moves`
- `test_solid_blob_at_all_required_azimuths_passes`
- `test_tiny_hole_does_not_trip_the_gate`
- `test_unsegmentable_capture_blocks_the_gate_instead_of_passing`
- `test_wraparound_azimuth_matches_required_zero`
- `write_rgb_png`

---

## [img2threejs\forge\tests\test_uv_unwrap.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_uv_unwrap.py)

**Details:** Source code file.

**Functions / Classes:**
- `ChartTopology`
- `ConformalCorrectness`
- `DegenerateInput`
- `Packing`
- `SeamHonesty`
- `Segmentation`
- `open_cylinder`
- `planar_grid`
- `ratio`
- `test_a_curved_chart_costs_area_and_the_number_says_so`
- `test_closed_cube_surface_is_not_a_disk`
- `test_cube_splits_into_six_planar_charts`
- `test_empty_chart_list_does_not_crash_the_packer`
- `test_empty_vertices_raise`
- `test_enforce_disk_charts_terminates_and_covers_every_face`
- `test_every_face_lands_in_exactly_one_chart`
- `test_flat_grid_is_a_disk`
- `test_grouped_and_flat_index_encodings_agree`
- `test_growth_is_measured_against_the_seed_not_the_neighbour`
- `test_multi_chart_mesh_reports_its_seam_vertices`
- `test_open_cylinder_is_not_a_disk`
- `test_packed_uvs_stay_inside_the_unit_square`
- `test_packing_reports_efficiency_rather_than_claiming_optimality`
- `test_planar_grid_unwraps_without_distortion`
- `test_planar_grid_uv_preserves_relative_distances`
- `test_too_few_indices_raise`
- `test_uncut_tube_is_split_into_disks_not_merely_reported`
- `unit_cube`

---

## [img2threejs\forge\tests\test_validate_rig_payload.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_validate_rig_payload.py)

**Details:** Source code file.

**Functions / Classes:**
- `ValidateRigPayloadTest`
- `payload`
- `test_duplicate_names_and_bad_matrix_are_hard_gates`
- `test_parent_order_is_hard_gate`
- `test_valid_payload_passes`
- `test_weight_normalization_and_nan_are_hard_gates`

---

## [img2threejs\forge\tests\test_vertex_paint.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_vertex_paint.py)

**Details:** Source code file.

**Functions / Classes:**
- `GeneratorEmission`
- `MalformedDeclaration`
- `Rejection`
- `ShapePredicates`
- `SpecValidation`
- `TypeScriptParity`
- `_painted_spec`
- `_spec_with`
- `test_a_bad_colour_string_is_rejected`
- `test_a_capsule_with_identical_endpoints_is_rejected`
- `test_a_gradient_component_keeps_its_material_albedo`
- `test_a_hard_boundary_gives_only_zero_or_one_weight`
- `test_a_malformed_declaration_raises_instead_of_degrading_to_flat_colour`
- `test_a_painted_component_gets_a_white_material_albedo`
- `test_a_point_claimed_by_nothing_keeps_the_base_colour`
- `test_a_zero_radius_ellipsoid_is_rejected`
- `test_an_unknown_kind_is_rejected_rather_than_ignored`
- `test_an_unpainted_component_does_not_enable_vertex_colours_at_all`
- `test_axis_band_is_inside_between_its_planes_and_outside_beyond_them`
- `test_duplicate_region_ids_are_rejected`
- `test_later_regions_win_where_they_overlap`
- `test_python_and_typescript_agree_on_every_sample_point`
- `test_softness_produces_intermediate_weights_only_inside_its_band`
- `test_tapered_capsule_radius_grows_from_start_to_end`
- `test_the_helper_is_emitted_only_when_a_component_declares_paint`
- `test_the_parity_harness_would_catch_a_divergence`
- `test_validator_accepts_a_well_formed_paint_block`
- `test_validator_rejects_a_malformed_paint_block`
- `test_validator_rejects_paint_and_gradient_on_the_same_component`

---

## [img2threejs\forge\tests\test_visual_hull.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_visual_hull.py)

**Details:** Source code file.

**Functions / Classes:**
- `VisualHullContractTest`
- `compile_generated_module`
- `import_forge_modules`
- `load_fixture`
- `read_bounds`
- `test_accepts_two_orthographic_silhouettes_with_bounded_budget`
- `test_component_local_bounds_preserve_component_transform_application`
- `test_contradictory_silhouettes_raise_typed_occupancy_error`
- `test_generated_visual_hull_is_deterministic_welded_and_manifold`
- `test_rejects_invalid_visual_hull_shape_bounds_confidence_and_budget`
- `test_requires_two_views_and_preserves_default_source_without_helper`

---

## [img2threejs\forge\tests\test_visual_hull_carve.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_visual_hull_carve.py)

**Details:** Source code file.

**Functions / Classes:**
- `CarveConventions`
- `CarveGeometry`
- `CarveHonesty`
- `descriptor`
- `disc_mask`
- `solid_mask`
- `test_a_view_that_sees_background_carves_the_voxel_away`
- `test_budget_is_guaranteed_upstream_so_the_carve_needs_no_verdict`
- `test_carved_surface_is_watertight`
- `test_concavity_limitation_is_always_stated`
- `test_disjoint_silhouettes_carve_everything_away_and_say_so`
- `test_front_view_rows_run_downward_in_y`
- `test_invalid_descriptor_raises_rather_than_carving_nonsense`
- `test_three_discs_carve_a_rounded_solid_not_the_whole_box`
- `test_three_views_leave_nothing_unconstrained`
- `test_two_views_report_the_unconstrained_axis`

---

## [img2threejs\forge\tests\test_vlm_gate.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_vlm_gate.py)

**Details:** Source code file.

**Functions / Classes:**
- `VlmGateTest`
- `const_sampler`
- `high_all`
- `run_main_with_samples`
- `sampler`
- `test_aggregate_median`
- `test_calibrate_identity_and_monotonic`
- `test_cli_rejects_empty_samples`
- `test_cli_rejects_non_list_samples`
- `test_cli_rejects_non_object_sample_entries`
- `test_evidence_consistent_unknown_geometry`
- `test_evidence_contradiction_is_uncertain`
- `test_hard_gate_failure_does_not_consult_vlm`
- `test_high_sample_spread_is_uncertain_probe`
- `test_low_objectness_withholds_refine_spec`
- `test_low_structural_withholds_refine_code`
- `test_no_sampler_keeps_deterministic_verdict`
- `test_pass_confirmed_when_all_criteria_high`
- `test_soft_reject_rescued_by_vlm`

---

## [img2threejs\forge\tests\test_workflow_state.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_workflow_state.py)

**Details:** Source code file.

**Functions / Classes:**
- `WorkflowStateTest`
- `test_all_direct_router_references_exist`
- `test_character_state_requires_contract_landmarks_and_route_decision`
- `test_checklist_cannot_be_completed_out_of_order`
- `test_completing_a_mandatory_step_requires_evidence`
- `test_cs2_state_includes_classification_and_manifest_before_pre_spec`
- `test_generic_state_starts_with_mandatory_image_analysis`
- `test_material_reference_wiring_is_in_the_setup_checklist`
- `test_new_pass_and_refine_spec_regenerate_with_force`
- `test_new_pass_archives_and_resets_pass_checklist`
- `test_next_cli_emits_only_state_ordered_build_command`
- `test_next_cli_reads_a_spec_that_exists_rather_than_the_pre_spec_checklist`
- `test_next_cli_reads_state_before_a_spec_exists`
- `test_next_cli_reads_state_when_init_recorded_a_spec_path_that_is_not_written_yet`
- `test_next_cli_rejects_a_spec_that_differs_from_state`
- `test_next_cli_returns_nonzero_at_loop_ceiling`
- `test_next_cli_still_fails_on_an_unreadable_spec_without_state`
- `test_pass_commands_follow_executable_gate_order`
- `test_per_pass_refine_limit_is_a_hard_stop`
- `test_refine_review_resets_same_pass_checklist_once`
- `test_skill_router_keeps_mandatory_state_and_reference_gates_visible`
- `test_skipping_a_mandatory_step_requires_reason`
- `test_state_cli_does_not_expose_manual_pass_bypass`
- `test_total_refine_limit_is_a_hard_stop`

---

## [img2threejs\forge\tests\test_ws6_docs.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/tests/test_ws6_docs.py)

**Details:** Source code file.

**Functions / Classes:**
- `Ws6DocsTest`
- `test_changelog_defines_each_link_reference_once`
- `test_fitting_doc_mentions_divine_eye_loop`
- `test_readme_declares_one_version_badge_matching_the_skill`
- `test_skill_version_is_reachable_by_the_release_tooling`
- `test_ws6_docs_exist`

---

## [img2threejs\forge\_shared\artifact_cache.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/artifact_cache.py)

**Details:** Source code file.

**Functions / Classes:**
- `cache_key`
- `file_sha256`
- `get_cached`
- `load_manifest`
- `manifest_path_for`
- `put_cached`
- `save_manifest`

---

## [img2threejs\forge\_shared\chirality.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/chirality.py)

**Details:** Source code file.

**Functions / Classes:**
- `check_pair`
- `classify_relation`
- `close`
- `compare_bias`
- `find_pairs`
- `medial_lateral_bias`
- `mirror_point`
- `mirror_vector`
- `pair_stem`
- `sagittal_symmetry_error`
- `side_of`

---

## [img2threejs\forge\_shared\color_metrics.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/color_metrics.py)

**Details:** Source code file.

**Functions / Classes:**
- `_lin`
- `ciede2000`
- `delta_e_rgb`
- `f`
- `hp`
- `srgb_to_lab`

---

## [img2threejs\forge\_shared\feature_acceptance_policy.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/feature_acceptance_policy.py)

**Details:** Source code file.

**Functions / Classes:**
- `feature_gate_failures`
- `feature_review_policy`
- `feature_targets_for_pass`
- `is_number`

---

## [img2threejs\forge\_shared\image_hash.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/image_hash.py)

**Details:** Source code file.

**Functions / Classes:**
- `_dct_2d`
- `_dct_matrix`
- `hamming`
- `normalized_similarity`
- `phash`
- `phash_from_image`
- `to_grayscale_downsampled`

---

## [img2threejs\forge\_shared\jpeg.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/jpeg.py)

**Details:** Source code file.

**Functions / Classes:**
- `UnsupportedJpeg`
- `_BitReader`
- `__init__`
- `_axis_map`
- `_bilinear`
- `_build_huffman`
- `_clamp`
- `_decode_huffman`
- `_extend`
- `_fill`
- `_idct_2d`
- `bit`
- `decode_jpeg`
- `is_jpeg`
- `receive`
- `sync_restart`

---

## [img2threejs\forge\_shared\material_physics.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/material_physics.py)

**Details:** Source code file.

**Functions / Classes:**
- `_max_channel`
- `_number`
- `check_material_physics`
- `check_open_boundary_sides`
- `compensated_base_luminance`
- `effective_sheen_strength`
- `sheen_base_darkening`

---

## [img2threejs\forge\_shared\pipeline_routing.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/pipeline_routing.py)

**Details:** Source code file.

**Functions / Classes:**
- `_explicit_classification`
- `_fallback_classification`
- `_normalize_classification`
- `classification_from_cs2_manifest`
- `resolve_pipeline_routing`
- `validate_pipeline_routing`

---

## [img2threejs\forge\_shared\scalp_field.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/scalp_field.py)

**Details:** Source code file.

**Functions / Classes:**
- `ScalpField`
- `__init__`
- `_finite`
- `distance`
- `field_from_component`
- `normal`
- `normalise_rings`
- `radial_distance`
- `sample`
- `section`
- `surface_samples`

---

## [img2threejs\forge\_shared\sdf_primitives.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/sdf_primitives.py)

**Details:** Source code file.

**Functions / Classes:**
- `_is_number`
- `_validate_finite`
- `_validate_operation`
- `_validate_positive`
- `_validate_primitive`
- `_validate_vector`
- `validate_sdf_descriptor`

---

## [img2threejs\forge\_shared\spec_search.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/spec_search.py)

**Details:** Source code file.

**Functions / Classes:**
- `AliasSettings`
- `Bm25Config`
- `Bm25Index`
- `Bm25Settings`
- `CachePayload`
- `CacheReadError`
- `CacheValidationError`
- `CacheWriteError`
- `CachedEvidenceReference`
- `CachedEvidenceReferenceRequired`
- `CachedPosting`
- `CachedRecord`
- `CachedSourceReference`
- `CollectionProfile`
- `ConfiguredSource`
- `EvidenceRef`
- `EvidenceRefRequired`
- `EvidenceReference`
- `IndexBuildError`
- `IndexFingerprints`
- `IndexLoadResult`
- `IndexRequest`
- `Measurement`
- `MeasurementRequired`
- `Posting`
- `ProfileCachePathError`
- `ProfileValidationError`
- `SearchMatch`
- `SearchOutputRequest`
- `SerializedSearchMatch`
- `SourceDocument`
- `SourceIngestionError`
- `SourceRef`
- `SourceRefRequired`
- `SourceReference`
- `SpecRecord`
- `SpecRecordValidationError`
- `TokenizerConfig`
- `TokenizerSettings`
- `UnknownCollectionError`
- `__str__`
- `_accent_companion`
- `_alias_mapping`
- `_cache_bool`
- `_cache_float`
- `_cache_integer`
- `_cache_mapping`
- `_cache_optional_string`
- `_cache_path`
- `_cache_payload`
- `_cache_string`
- `_cache_string_list`
- `_cache_validation_error`
- `_cached_evidence_reference`
- `_cached_record`
- `_cached_source_reference`
- `_configured_project_path`
- `_configured_sources`
- `_document_key`
- `_earliest_token_offset`
- `_evidence_refs`
- `_fingerprint`
- `_hidden_source`
- `_index_config`
- `_index_fingerprints`
- `_ingest_configured_sources`
- `_ingest_jsonl`
- `_json_content`
- `_mapping`
- `_measurements`
- `_parse_cache`
- `_parse_cached_evidence_reference`
- `_parse_cached_record`
- `_parse_cached_reference`
- `_parse_cached_tokenizer`
- `_parse_integer_mapping`
- `_parse_postings`
- `_parse_record`
- `_parse_term_aliases`
- `_primary_tokens`
- `_profile_accent_fold`
- `_profile_bool`
- `_profile_cache_path`
- `_profile_error`
- `_profile_normalization`
- `_profile_number`
- `_profile_string`
- `_profile_string_list`
- `_read_cache`
- `_read_source`
- `_record_error`
- `_record_mapping`
- `_record_string`
- `_record_string_list`
- `_reference_key`
- `_resolve_source_section`
- `_searchable_text`
- `_source_fingerprint`
- `_source_kind`
- `_source_reference`
- `_source_refs`
- `_source_tree_files`
- `_tokenizer_config`
- `_tokenizer_settings`
- `_trim_word_boundaries`
- `_with_accent_companions`
- `_write_cache`
- `append_section`
- `assert_never`
- `build_index`
- `combined`
- `fingerprint`
- `ingest_json`
- `ingest_markdown`
- `ingest_source_tree`
- `load_jsonl_records`
- `load_or_build_index`
- `load_profile`
- `load_profiles`
- `search_index`
- `section_snippet`
- `serialize_search_results`
- `tokenize`
- `visit`

---

## [img2threejs\forge\_shared\status_banner.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/status_banner.py)

**Details:** Source code file.

**Functions / Classes:**
- `_pipeline`
- `emit_status`
- `load_optional_spec`

---

## [img2threejs\forge\_shared\subdivision.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/subdivision.py)

**Details:** Source code file.

**Functions / Classes:**
- `capsule_source_face_count`
- `cylinder_source_face_count`
- `resolve_instanced_cluster_base`
- `segments_for_spec`
- `tier_for_target_triangles`
- `validate_tier`

---

## [img2threejs\forge\_shared\vertex_paint.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/vertex_paint.py)

**Details:** Source code file.

**Functions / Classes:**
- `VertexPaintError`
- `_as_number`
- `_as_vec3`
- `_smoothstep`
- `classify_points`
- `dominant_region`
- `normalize_region`
- `normalize_vertex_paint`
- `paint_point`
- `parse_hex_color`
- `region_weight`
- `signed_distance`

---

## [img2threejs\forge\_shared\workflow_state.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/forge/_shared/workflow_state.py)

**Details:** Source code file.

**Functions / Classes:**
- `WorkflowStateError`
- `_entries`
- `_format_command`
- `_pending`
- `_step`
- `load_state`
- `mark_steps`
- `new_state`
- `next_entry`
- `recompute`
- `save_state`
- `set_current_pass`
- `status_payload`
- `sync_from_spec`
- `validate_state`

---

## [img2threejs\integrations\glb_character_pipeline\python\bake_atlas_uvs.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/integrations/glb_character_pipeline/python/bake_atlas_uvs.py)

**Details:** Source code file.

**Functions / Classes:**
- `Grid`
- `__init__`
- `acc`
- `candidates`
- `main`
- `read_node`

---

## [img2threejs\integrations\glb_character_pipeline\python\build_cross_sections.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/integrations/glb_character_pipeline/python/build_cross_sections.py)

**Details:** Source code file.

**Functions / Classes:**
- `bboxes`
- `cloud_bboxes`
- `emit`
- `main`
- `region_rings`
- `verify_frozen`

---

## [img2threejs\integrations\glb_character_pipeline\python\build_head_surface.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/integrations/glb_character_pipeline/python/build_head_surface.py)

**Details:** Source code file.

**Functions / Classes:**
- `acc`

---

## [img2threejs\integrations\glb_character_pipeline\python\export_sdf_surfaces.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/integrations/glb_character_pipeline/python/export_sdf_surfaces.py)

**Details:** Source code file.

**Functions / Classes:**
- `acc`
- `embedded_image`
- `sample_texture`

---

## [img2threejs\integrations\glb_character_pipeline\python\measure_density_convergence.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/integrations/glb_character_pipeline/python/measure_density_convergence.py)

**Details:** Source code file.

**Functions / Classes:**
- `band_at`
- `biggest_cluster`
- `empty_bin_fraction`
- `main`
- `outline_on_rays`

---

## [img2threejs\integrations\glb_character_pipeline\python\slice_node.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/integrations/glb_character_pipeline/python/slice_node.py)

**Details:** Source code file.

**Functions / Classes:**
- `cluster_slice`
- `convex_hull`
- `cross`
- `decimate_ring`
- `main`
- `radial_outline`
- `read_node_positions`
- `resample_ring`
- `slice_node`

---

## [img2threejs\integrations\mesh3d\generate_reference_mesh.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/integrations/mesh3d/generate_reference_mesh.py)

**Details:** Source code file.

**Functions / Classes:**
- `generate`
- `inspect_glb`
- `main`
- `parse_args`
- `write_obj`

---

## [img2threejs\integrations\vision\reference_vision.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/integrations/vision/reference_vision.py)

**Details:** Source code file.

**Functions / Classes:**
- `_category_payload`
- `_device_name`
- `_download`
- `_load_image`
- `_sha256`
- `_versions`
- `_write_json`
- `build_parser`
- `command_depth`
- `command_health`
- `command_landmarks`
- `command_prefetch`
- `command_segment`
- `main`

---

## [img2threejs\scripts\capture_threejs_playwright.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/scripts/capture_threejs_playwright.py)

**Details:** Source code file.

**Functions / Classes:**
- `capture`
- `main`

---

## [img2threejs\scripts\issue_triage.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/scripts/issue_triage.py)

**Details:** Source code file.

**Functions / Classes:**
- `GitHubIssueApi`
- `Issue`
- `IssueApi`
- `MissingQueueLabelError`
- `TriageOptions`
- `TriageResult`
- `__init__`
- `_request`
- `add_label`
- `create_notice`
- `get_issue`
- `has_notice_marker`
- `is_rollout_candidate`
- `list_open_issues`
- `main`
- `parse_issue`
- `queue_label_exists`
- `run_triage`

---

## [img2threejs\scripts\release_metadata.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/img2threejs/scripts/release_metadata.py)

**Details:** Source code file.

**Functions / Classes:**
- `ReleaseLevel`
- `ReleasePlan`
- `ReleaseRequest`
- `Version`
- `__str__`
- `apply_release`
- `bump`
- `change_sections`
- `main`
- `parse_commits`
- `parse_version`
- `release_level`
- `replace_once`
- `update_changelog`

---

## [simulation\adaptive\adaptive_reference.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/adaptive/adaptive_reference.py)

**Details:** Source code file.

**Functions / Classes:**
- `PhenoraAdaptiveGoldenModel`
- `__init__`
- `process_sample`

---

## [simulation\adaptive\generate_test_vectors.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/adaptive/generate_test_vectors.py)

**Details:** Source code file.

**Functions / Classes:**
- `main`
- `run_vector`

---

## [simulation\fem\scripts\adaptive_reference.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/fem/scripts/adaptive_reference.py)

**Details:** Source code file.

**Functions / Classes:**
- `PhenoraAdaptiveFSM`
- `__init__`
- `main`
- `process_step`
- `run_test_vector`

---

## [simulation\fem\scripts\plot_results.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/fem/scripts/plot_results.py)

**Details:** Source code file.

*No functions detected.*

---

## [simulation\fem\scripts\run_conductivity_sweep.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/fem/scripts/run_conductivity_sweep.py)

**Details:** Source code file.

**Functions / Classes:**
- `analytical_resistance`
- `create_case_instance`
- `main`
- `parse_effective_resistance`
- `run_elmer_instance`

---

## [simulation\fem\scripts\run_delta_sigma_sweep.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/fem/scripts/run_delta_sigma_sweep.py)

**Details:** Source code file.

**Functions / Classes:**
- `main`
- `run_fem_instance`

---

## [simulation\fem\scripts\run_differential_fem.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/fem/scripts/run_differential_fem.py)

**Details:** Source code file.

**Functions / Classes:**
- `compute_logistic_cell_fraction`
- `create_and_run_fem`
- `main`

---

## [simulation\fem\scripts\run_mesh_convergence.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/fem/scripts/run_mesh_convergence.py)

**Details:** Source code file.

**Functions / Classes:**
- `build_geo_file`
- `main`
- `run_case_convergence`

---

## [simulation\python\ast_trajectory.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/python/ast_trajectory.py)

**Details:** Source code file.

**Functions / Classes:**
- `compute_cell_fraction_trajectory`
- `simulate_growth_profiles`

---

## [simulation\python\cell_model.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/python/cell_model.py)

**Details:** Source code file.

**Functions / Classes:**
- `compute_effective_conductivity`

---

## [simulation\python\conductivity_model.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/python/conductivity_model.py)

**Details:** Source code file.

**Functions / Classes:**
- `compute_medium_conductivity`

---

## [simulation\python\electrode_model.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/python/electrode_model.py)

**Details:** Source code file.

**Functions / Classes:**
- `map_conductivity_to_solution_resistance`

---

## [simulation\python\generate_dataset.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/python/generate_dataset.py)

**Details:** Source code file.

**Functions / Classes:**
- `run_full_simulation`

---

## [simulation\python\impedance_model.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/python/impedance_model.py)

**Details:** Source code file.

**Functions / Classes:**
- `compute_impedance`
- `get_magnitude_and_phase`

---

## [simulation\python\temperature_model.py](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/simulation/python/temperature_model.py)

**Details:** Source code file.

**Functions / Classes:**
- `generate_temperature_profile`

---

## [web\next-env.d.ts](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/next-env.d.ts)

**Details:** Source code file.

*No functions detected.*

---

## [web\next.config.ts](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/next.config.ts)

**Details:** Source code file.

*No functions detected.*

---

## [web\src\app\layout.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/app/layout.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `RootLayout`

---

## [web\src\app\page.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/app/page.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `Home`

---

## [web\src\app\platform\page.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/app/platform/page.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `Platform`

---

## [web\src\app\research\page.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/app/research/page.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `Research`

---

## [web\src\app\spectrae\page.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/app/spectrae/page.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `SimulationLab`
- `freqToX`
- `handleReset`
- `handleRunDemo`
- `valToY`

---

## [web\src\app\team\page.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/app/team/page.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `Team`

---

## [web\src\app\technology\page.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/app/technology/page.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `Technology`

---

## [web\src\components\navigation\Navbar.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/navigation/Navbar.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `Navbar`

---

## [web\src\components\product\ArchitectureFlow.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/product/ArchitectureFlow.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `ArchitectureFlow`

---

## [web\src\components\product\ProductViewer.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/product/ProductViewer.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `Line`
- `ModelScene`
- `ProductViewer`
- `handleResetCamera`

---

## [web\src\components\shared\Footer.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/shared/Footer.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `Footer`

---

## [web\src\components\simulation\AdaptiveDecisionPanel.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/AdaptiveDecisionPanel.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `AdaptiveDecisionPanel`

---

## [web\src\components\simulation\AmrieInterpretationPanel.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/AmrieInterpretationPanel.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `AmrieInterpretationPanel`
- `fetchInterpretation`

---

## [web\src\components\simulation\FemViewer.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/FemViewer.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `FemViewer`

---

## [web\src\components\simulation\GeneralPublicMode.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/GeneralPublicMode.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `GeneralPublicMode`

---

## [web\src\components\simulation\MeasurementQuality.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/MeasurementQuality.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `MeasurementQuality`

---

## [web\src\components\simulation\SimulationScene.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/SimulationScene.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `AnimatedHardwareGroup`
- `CellularInclusions`
- `ConnectorPin`
- `DataPulse`
- `GroundPlane`
- `MeasurementFlow`
- `RealisticWire`
- `SceneContent`
- `SimulationScene`
- `handleKey`
- `onKeyDown`
- `onKeyUp`
- `phaseGte`

---

## [web\src\components\simulation\StatusBadge.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/StatusBadge.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `StatusBadge`

---

## [web\src\components\simulation\TechnicalDetails.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/TechnicalDetails.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `TechnicalDetails`

---

## [web\src\components\simulation\WorkflowTimeline.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/WorkflowTimeline.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `WorkflowTimeline`

---

## [web\src\components\simulation\hardware\Ad5933Board.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/hardware/Ad5933Board.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `Ad5933Board`

---

## [web\src\components\simulation\hardware\ChamberDualWell.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/hardware/ChamberDualWell.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `ACExcitationField`
- `ChamberDualWell`

---

## [web\src\components\simulation\hardware\HeltecBoard.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/hardware/HeltecBoard.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `HeltecBoard`

---

## [web\src\components\simulation\hardware\VsdFpgaBoard.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/simulation/hardware/VsdFpgaBoard.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `VsdFpgaBoard`

---

## [web\src\components\ui\BorderGlow.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/ui/BorderGlow.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `BorderGlow`
- `handleMouseMove`

---

## [web\src\components\ui\ShinyText.tsx](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/components/ui/ShinyText.tsx)

**Details:** Source code file.

**Functions / Classes:**
- `ShinyText`

---

## [web\src\data\conductivitySweep.ts](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/data/conductivitySweep.ts)

**Details:** Source code file.

*No functions detected.*

---

## [web\src\data\differentialTrajectory.ts](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/data/differentialTrajectory.ts)

**Details:** Source code file.

*No functions detected.*

---

## [web\src\data\meshConvergence.ts](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/data/meshConvergence.ts)

**Details:** Source code file.

*No functions detected.*

---

## [web\src\data\validationStatus.ts](file:///d:/Users/DT/Sem 05/Hecks/CIT/PHENORA/web/src/data/validationStatus.ts)

**Details:** Source code file.

*No functions detected.*

---

