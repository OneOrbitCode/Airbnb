import React from 'react';
import Link from 'next/link';

interface ListingCardProps {
  id?: number;
  imageSrc: string;
  location: string;
  distance: string;
  dateRange: string;
  price: string;
  rating: number;
  guestFavorite?: boolean;
}

export default function ListingCard({
  id,
  imageSrc,
  location,
  distance,
  dateRange,
  price,
  rating,
  guestFavorite = false,
}: ListingCardProps) {
  const innerContent = (
    <div className="c1l1h97y atm_9s_11p5wf0 atm_fc_1yb4nlp atm_1wn1q82_1d0pyjx atm_3f_glywfm atm_70_ptm3g8 atm_7l_16y9w8o dir dir-ltr">
      <div className="c14whb16 atm_9s_1txwivl atm_1a_1907lkk dir dir-ltr">
        <div className="cgllpht atm_9s_1txwivl atm_fc_1h6ojuz atm_vy_1osqo2v dir dir-ltr">
          <div className="cy5jw6o atm_9s_11p5wf0 atm_dz_1osqo2v atm_1c_x36e2f atm_gi_idpfg4 atm_l8_idpfg4 atm_fc_1h6ojuz atm_h_1h6ojuz dir dir-ltr">
            <div className="cpig6a5 atm_9s_11p5wf0 atm_e2_1osqo2v atm_vy_1osqo2v atm_dz_vud8gm atm_5j_t09oo2 atm_mk_h2mmj6 dir dir-ltr">
              <div className="cm50v04 atm_9s_1txwivl atm_ar_1bp4okc atm_fc_1yb4nlp atm_h_1h6ojuz atm_mk_h2mmj6 dir dir-ltr">
                <img className="itu7s9v atm_9s_11p5wf0 atm_h_1h6ojuz atm_fc_1yb4nlp atm_1wn1q82_1c2cny atm_70_w3174k atm_2d_j9412j_1rqz0hn atm_2d_j9412j_pfnrn2 dir dir-ltr" aria-hidden="true" alt="Listing" decoding="async" src={imageSrc} style={{ objectFit: 'cover' }} />
              </div>
            </div>
            
            {/* Heart Icon Container */}
            <div className="cv7z28m atm_9s_1txwivl atm_e2_qf745n atm_vy_1wugsn5 atm_1g_1osqo2v atm_5j_1ssbidh dir dir-ltr">
              <button aria-label="Add to wishlist" type="button" className="b2v5cnd atm_1s_glywfm atm_26_1j28jx2 atm_3f_idpfg4 atm_7l_1kw7nm4 atm_9j_tlke0l atm_9s_1o8liyq atm_bx_1kw7nm4 atm_c8_1kw7nm4 atm_cs_1kw7nm4 atm_g3_1kw7nm4 atm_gi_idpfg4 atm_ks_ewfl5b atm_l8_idpfg4 atm_r3_1kw7nm4 atm_rd_glywfm atm_vb_1wugsn5 atm_kd_glywfm atm_mj_1rj4a2z atm_5j_12am3vd atm_3f_glywfm_jo46a5 atm_l8_idpfg4_jo46a5 atm_gi_idpfg4_jo46a5 atm_3f_glywfm_1icshfk atm_kd_glywfm_19774hq atm_70_1l64qlu_1w3cfyq dir dir-ltr">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'rgba(0, 0, 0, 0.5)', height: '24px', width: '24px', stroke: 'var(--color-airbnb-border, white)', strokeWidth: 2, overflow: 'visible' }}>
                  <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path>
                </svg>
              </button>
            </div>
            
            {/* Guest favorite Badge */}
            {guestFavorite && (
              <div className="ch02i1c atm_9s_11p5wf0 atm_e2_1osqo2v atm_vy_1osqo2v atm_dz_vud8gm atm_5j_1s1c0s2 atm_6h_1y44olf dir dir-ltr">
                <div className="b1xxj4k5 atm_mk_h2mmj6 atm_fq_1s1c0s2 atm_ks_15vqwwr atm_cs_x4d4c5 atm_7l_hfv0h6 atm_vy_1osqo2v atm_e2_1osqo2v atm_mj_glywfm atm_4b_1pbc45q atm_9s_11p5wf0 atm_fc_1h6ojuz atm_c8_vvn7el atm_g3_k2d186 atm_fr_11a07z3 atm_jb_111tov atm_1h_1vi7ecw atm_vv_1q9ccgz dir dir-ltr">
                  Guest favorite
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Info Block */}
        <div className="m1u96nt4 atm_9s_11p5wf0 atm_1c_x36e2f atm_gi_idpfg4 atm_l8_idpfg4 atm_vy_1wugsn5 atm_e2_sz6sci dir dir-ltr">
          <div className="i1n0n2er atm_9s_11p5wf0 atm_fc_1yb4nlp atm_1wn1q82_1c2cny dir dir-ltr">
            <div className="ifmtkic atm_9s_11p5wf0 atm_dz_vud8gm dir dir-ltr">
              <div className="id42x7a atm_9s_1txwivl atm_1a_805uav atm_h_1h6ojuz atm_fc_1h6ojuz dir dir-ltr">
                <div className="t1jcgop2 atm_c8_vvn7el atm_g3_k2d186 atm_fr_11a07z3 atm_cs_9ztszc atm_7l_1vi7ecw atm_5j_1vi7ecw atm_70_1m4mje8 atm_mk_h2mmj6 atm_kd_glywfm atm_1c_1j28jx2 atm_gi_idpfg4 atm_l8_idpfg4 dir dir-ltr">{location}</div>
              </div>
              <div className="idw4bny atm_9s_1txwivl atm_ar_1bp4okc atm_cx_1osqo2v atm_fc_1h6ojuz dir dir-ltr">
                <span className="ru0q88m atm_c8_sz6sci atm_g3_17zsb9a atm_fr_11a07z3 atm_cs_1w07xya atm_7l_1cw1hnu atm_kd_glywfm dir dir-ltr">
                  <span className="a8jt5op atm_3f_idpfg4 atm_7h_hxbz6r atm_7i_ysn8ba atm_e2_t94yts atm_ks_zryt35 atm_l8_idpfg4 atm_mk_stnw88 atm_vv_1q9ccgz atm_vy_t94yts dir dir-ltr">Rating</span>
                  <span aria-hidden="true" className="r1dxllyb atm_7l_18pqv07 atm_vy_1wugsn5 atm_e2_1osqo2v atm_5j_1osqo2v atm_ks_15vqwwr atm_wq_kb7nvz dir dir-ltr">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '12px', width: '12px', fill: 'currentcolor' }}>
                      <path fillRule="evenodd" d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"></path>
                    </svg>
                  </span>
                  <span aria-hidden="true">{rating}</span>
                </span>
              </div>
            </div>
            
            <div className="s1cjqx9f atm_c8_sz6sci atm_g3_17zsb9a atm_fr_11a07z3 atm_cs_1w07xya atm_7l_1cw1hnu atm_kd_glywfm dir dir-ltr">
              <span className="t6mzqp7 atm_9s_11p5wf0 atm_dz_1r26uof atm_5j_1vi7ecw atm_70_1m4mje8 atm_1c_1j28jx2 atm_gi_idpfg4 atm_l8_idpfg4 dir dir-ltr" aria-hidden="true">{distance}</span>
            </div>
            <div className="s1cjqx9f atm_c8_sz6sci atm_g3_17zsb9a atm_fr_11a07z3 atm_cs_1w07xya atm_7l_1cw1hnu atm_kd_glywfm dir dir-ltr">
              <span className="t6mzqp7 atm_9s_11p5wf0 atm_dz_1r26uof atm_5j_1vi7ecw atm_70_1m4mje8 atm_1c_1j28jx2 atm_gi_idpfg4 atm_l8_idpfg4 dir dir-ltr" aria-hidden="true">{dateRange}</span>
            </div>
            
            <div className="p6y7dnm atm_c8_vvn7el atm_g3_k2d186 atm_fr_11a07z3 atm_cs_9ztszc atm_7l_1vi7ecw atm_kd_glywfm dir dir-ltr" style={{ marginTop: '6px' }}>
              <div className="p1rwe3a4 atm_9s_11p5wf0 atm_dz_vud8gm dir dir-ltr">
                <span className="a8jt5op atm_3f_idpfg4 atm_7h_hxbz6r atm_7i_ysn8ba atm_e2_t94yts atm_ks_zryt35 atm_l8_idpfg4 atm_mk_stnw88 atm_vv_1q9ccgz atm_vy_t94yts dir dir-ltr">Price</span>
                <div className="_i5tdk5">
                  <span className="_1y74zjx">
                    <span className="a8jt5op atm_3f_idpfg4 atm_7h_hxbz6r atm_7i_ysn8ba atm_e2_t94yts atm_ks_zryt35 atm_l8_idpfg4 atm_mk_stnw88 atm_vv_1q9ccgz atm_vy_t94yts dir dir-ltr">Price</span>
                    <span className="_1ks8cgb" style={{ whiteSpace: 'nowrap' }}>₹{price}</span>
                  </span>
                  <span className="_145p52w"> <span className="_41235j">night</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="c1tzmtyg atm_1s_glywfm dir dir-ltr">
      {id ? (
        <Link href={`/listings/${id}`} className="w-full">
          {innerContent}
        </Link>
      ) : (
        innerContent
      )}
    </div>
  );
}
