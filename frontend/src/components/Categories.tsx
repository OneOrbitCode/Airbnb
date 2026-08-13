import React from 'react';

const categories = [
  { label: 'Icons', src: 'https://a0.muscache.com/pictures/248f85bf-e35e-4dc3-a9a1-e1db65a8873a.jpg' },
  { label: 'Amazing pools', src: 'https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg' },
  { label: 'Farms', src: 'https://a0.muscache.com/pictures/aaa02c2d-9f0d-4c41-878a-68c12ec6c6bd.jpg' },
  { label: 'Rooms', src: 'https://a0.muscache.com/pictures/7630c120-d6a1-433a-9669-e70a92d4f3b2.jpg' },
  { label: 'Earth homes', src: 'https://a0.muscache.com/pictures/d7445031-62c4-46d5-a75d-d14211f34b36.jpg' },
  { label: 'Tropical', src: 'https://a0.muscache.com/pictures/ee9e2a40-ffac-4db9-9080-b351efc3cfc4.jpg' },
  { label: 'Castles', src: 'https://a0.muscache.com/pictures/1b6a8b70-a3b6-48b5-88e1-2243d9172c06.jpg' },
  { label: 'Treehouses', src: 'https://a0.muscache.com/pictures/4d4a4eba-c7e4-43eb-9ce2-95e1d200d10e.jpg' },
  { label: 'Mansions', src: 'https://a0.muscache.com/pictures/78ba8486-6ba6-4a43-a56d-f556189193da.jpg' },
  { label: 'Cabins', src: 'https://a0.muscache.com/pictures/732eda83-7498-4234-a111-442ae276a611.jpg' }
];

export default function Categories() {
  return (
    <div className="cb1pml0 atm_9s_11p5wf0 atm_mk_h2mmj6 atm_wq_kb7nvz atm_dz_vud8gm dir dir-ltr">
      <div className="cv80qyt atm_9s_1txwivl atm_ar_1bp4okc atm_fc_1h6ojuz atm_vy_1osqo2v dir dir-ltr" style={{ transform: 'none' }}>
        <div className="c1l7o0ar atm_1wn1q82_1d0pyjx dir dir-ltr">
          <div className="csx1nho atm_1c_1j28jx2 atm_gi_idpfg4 atm_l8_idpfg4 atm_5j_1ssbidh dir dir-ltr">
            
            {/* The carousel container */}
            <div className="chbxdg2 atm_9s_1txwivl atm_am_1wugsn5 atm_4b_1q0hcdb atm_gq_idpfg4 dir dir-ltr">
              <div role="tablist" aria-label="Categories" className="cd56ld atm_9s_11p5wf0 atm_4b_1oq6qme atm_dz_1r26uof dir dir-ltr" style={{ overflow: 'visible' }}>
                
                {categories.map((cat, index) => (
                  <div key={index} className="c1tzmtyg atm_1s_glywfm atm_26_1j28jx2 atm_7l_1kw7nm4 atm_9s_1o8liyq atm_bx_1kw7nm4 atm_c8_1kw7nm4 atm_cs_1kw7nm4 atm_g3_1kw7nm4 atm_kd_glywfm atm_l8_idpfg4 atm_r3_1kw7nm4 atm_rd_glywfm atm_vb_1wugsn5 atm_1s_glywfm_1nos8r atm_9j_tlke0l_1nos8r atm_26_1p8m8iw_1nos8r atm_7l_177v5fp_1nos8r atm_7l_1kw7nm4_pfnrn2 atm_1c_1kw7nm4_pfnrn2 atm_4b_1oq6qme atm_26_1h6ojuz atm_h_1h6ojuz atm_1p_1osqo2v dir dir-ltr" role="tab" aria-selected={index === 0}>
                    <button className="c2n3dij atm_1s_glywfm atm_26_1j28jx2 atm_3f_idpfg4 atm_7l_1kw7nm4 atm_9j_tlke0l atm_9s_1o8liyq atm_bx_1kw7nm4 atm_c8_1kw7nm4 atm_cs_1kw7nm4 atm_g3_1kw7nm4 atm_gi_idpfg4 atm_ks_ewfl5b atm_l8_idpfg4 atm_r3_1kw7nm4 atm_rd_glywfm atm_vb_1wugsn5 atm_kd_glywfm atm_mj_1rj4a2z atm_5j_12am3vd atm_3f_glywfm_jo46a5 atm_l8_idpfg4_jo46a5 atm_gi_idpfg4_jo46a5 atm_3f_glywfm_1icshfk atm_kd_glywfm_19774hq atm_70_1l64qlu_1w3cfyq dir dir-ltr" type="button">
                      <div className="cn8rdrk atm_9s_11p5wf0 atm_8w_1yxtnki atm_vy_1osqo2v atm_e2_1osqo2v atm_jb_111tov dir dir-ltr">
                        <img src={cat.src} alt="" className="i12q3jps atm_tr_18ws4an dir dir-ltr" width="24" height="24" />
                        <div className="c1n98tw7 atm_c8_1uc0753 atm_g3_lonqig atm_fr_1t35rce atm_cs_6zw0m5 atm_7l_14zl091 atm_9s_1o8liyq atm_vy_1osqo2v dir dir-ltr">
                          <span className="t1p8u25b atm_c8_sz6sci atm_g3_17zsb9a atm_fr_11a07z3 atm_cs_1w07xya atm_7l_1cw1hnu atm_e2_1osqo2v dir dir-ltr">{cat.label}</span>
                        </div>
                      </div>
                    </button>
                    {/* The active underline (for the first element only to mimic UI) */}
                    {index === 0 && (
                      <div className="ca0zuxv atm_mk_h2mmj6 atm_4b_1oq6qme atm_8w_q0y4tl atm_26_1h6ojuz atm_mj_1wugsn5 atm_e2_1osqo2v atm_7l_14zl091 dir dir-ltr"></div>
                    )}
                  </div>
                ))}
                
              </div>
            </div>
            
            {/* Filters Button */}
            <div className="fa54oij atm_mk_h2mmj6 atm_vq_kb7nvz atm_am_1wugsn5 dir dir-ltr">
              <div className="c5oiyky atm_9s_1txwivl atm_h_1h6ojuz atm_fc_1h6ojuz atm_e2_1osqo2v dir dir-ltr">
                <button type="button" className="bs1i8d8 atm_1s_glywfm atm_26_1j28jx2 atm_3f_idpfg4 atm_7l_1kw7nm4 atm_9j_tlke0l atm_9s_1o8liyq atm_bx_1kw7nm4 atm_c8_1kw7nm4 atm_cs_1kw7nm4 atm_g3_1kw7nm4 atm_gi_idpfg4 atm_ks_ewfl5b atm_l8_idpfg4 atm_r3_1kw7nm4 atm_rd_glywfm atm_vb_1wugsn5 atm_kd_glywfm atm_mj_1rj4a2z atm_5j_12am3vd atm_3f_glywfm_jo46a5 atm_l8_idpfg4_jo46a5 atm_gi_idpfg4_jo46a5 atm_3f_glywfm_1icshfk atm_kd_glywfm_19774hq atm_70_1l64qlu_1w3cfyq atm_1s_glywfm_1nos8r atm_26_1j28jx2_1nos8r atm_7l_1kw7nm4_1nos8r atm_9j_tlke0l_1nos8r atm_c8_1kw7nm4_1nos8r atm_cs_1kw7nm4_1nos8r atm_g3_1kw7nm4_1nos8r atm_l8_idpfg4_1nos8r atm_r3_1kw7nm4_1nos8r atm_rd_glywfm_1nos8r atm_vb_1wugsn5_1nos8r atm_26_1p8m8iw_1nos8r atm_7l_177v5fp_1nos8r atm_3f_glywfm_pfnrn2 atm_7l_1kw7nm4_pfnrn2 atm_gi_idpfg4_pfnrn2 atm_1s_glywfm_z5n1qr atm_26_1j28jx2_z5n1qr atm_7l_1kw7nm4_z5n1qr atm_9j_tlke0l_z5n1qr atm_c8_1kw7nm4_z5n1qr atm_cs_1kw7nm4_z5n1qr atm_g3_1kw7nm4_z5n1qr atm_l8_idpfg4_z5n1qr atm_r3_1kw7nm4_z5n1qr atm_rd_glywfm_z5n1qr atm_vb_1wugsn5_z5n1qr atm_26_1p8m8iw_z5n1qr atm_7l_177v5fp_z5n1qr atm_26_1j28jx2_1nos8r_uv4tnr atm_7l_1kw7nm4_1nos8r_uv4tnr atm_c8_1kw7nm4_1nos8r_uv4tnr atm_cs_1kw7nm4_1nos8r_uv4tnr atm_g3_1kw7nm4_1nos8r_uv4tnr atm_l8_idpfg4_1nos8r_uv4tnr atm_26_1p8m8iw_1nos8r_uv4tnr atm_7l_177v5fp_1nos8r_uv4tnr atm_26_1j28jx2_z5n1qr_uv4tnr atm_7l_1kw7nm4_z5n1qr_uv4tnr atm_c8_1kw7nm4_z5n1qr_uv4tnr atm_cs_1kw7nm4_z5n1qr_uv4tnr atm_g3_1kw7nm4_z5n1qr_uv4tnr atm_l8_idpfg4_z5n1qr_uv4tnr atm_26_1p8m8iw_z5n1qr_uv4tnr atm_7l_177v5fp_z5n1qr_uv4tnr atm_1c_1j28jx2_1w3cfyq atm_10_2gsv47_1w3cfyq atm_vy_567q3x atm_e2_567q3x dir dir-ltr">
                  <div className="f1xx5cjd atm_9s_11p5wf0 atm_dz_1r26uof atm_vy_1osqo2v atm_e2_1osqo2v dir dir-ltr">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '14px', width: '14px', stroke: 'currentcolor', strokeWidth: 4, overflow: 'visible' }}>
                      <path d="M7 16H3M29 16h-8M21 16a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM29 5h-8M7 5H3M21 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM29 27h-8M7 27H3M21 27a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path>
                    </svg>
                    <span className="tyy3g2s atm_c8_1gcojkr atm_g3_15xinxl atm_fr_1kw7nm4 atm_cs_1mexzig atm_7l_14zl091 atm_e2_1osqo2v dir dir-ltr">Filters</span>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
