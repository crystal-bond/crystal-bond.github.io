// Break points for long words in the justified texts (physics pages, line summaries, Technologies, the Home statement),
// written out by hand. build.js turns each hyphen into a soft hyphen; words not listed get only its few safe rules.
// To add a word: write it with hyphens where it may break, at least two letters on each side.
module.exports = `
crys-tals par-ti-cle par-ti-cles cur-va-ture de-tec-tor de-tec-tors ger-ma-nium ori-ent-ed sub-strate sub-strates
co-her-ent co-her-ent-ly in-co-her-ent chan-neled elec-tron elec-trons elec-tric elec-tron-volts po-si-tron po-si-trons
en-er-gies tung-sten tung-state crit-i-cal mag-net-ic calo-rim-e-ter calo-rim-e-ters ge-om-e-try de-flect-ed de-flec-tors
mea-sured mea-sur-able lab-o-ra-to-ry lab-o-ra-to-ries spher-i-cal sil-i-cate tele-scope tele-scopes de-pos-it-ed
bi-re-frin-gence bi-re-frin-gent clean-room dif-fract dif-fracts dif-fract-ed ma-te-ri-al amor-phous an-a-lyz-er an-a-lyz-ers
po-ten-tial trans-verse os-cil-late os-cil-lates mil-li-me-tre mil-li-me-tres cen-ti-me-tres mil-li-ra-di-ans mil-li-kelvin
re-flect-ed re-flects me-chan-i-cal me-chan-ics in-duc-tance fre-quen-cy fre-quen-cies dif-fer-ent dif-fer-ence base-line
to-geth-er cy-lin-dri-cal col-lab-o-ra-tive syn-chro-tron syn-chro-trons ra-di-ates pat-terned pat-tern-ing slight-ly
uni-ver-si-ty ef-fi-cien-cy ef-fi-cien-cies brems-strah-lung split-ter split-ters Eu-ro-pe-an av-er-aged an-iso-trop-ic
an-isot-ro-py iso-trop-ic chem-i-cal sur-faces neu-tri-no hun-dreds res-o-na-tor res-o-na-tors res-o-nance res-o-nant
back-ground el-e-ments tem-per-a-ture tem-per-a-tures di-rect-ly as-sem-bly as-sem-blies as-sem-bled spec-tros-co-py
dis-pensed un-du-la-tor un-du-la-tors frac-tion si-nu-soi-dal cryo-gen-ic sap-phire ac-cel-er-a-tors col-li-mate
build-ing in-jec-tor sim-u-late sim-u-lat-ed con-tin-u-ous con-tin-u-ous-ly con-tin-ues tra-jec-to-ry emis-sion
pol-ish-ing ab-la-tion mask-less pho-to-li-thog-ra-phy faith-ful-ly sep-a-rate ro-tat-ing mega-hertz pos-i-tive
pos-i-tive-ly neg-a-tive par-al-lel trap-ping there-fore what-ev-er when-ev-er in-com-ing dis-tort-ed stan-dard se-quence
steer-ing ca-pac-i-ty ab-sorb-er ab-sorb-ers alu-min-ium in-di-vid-u-al neigh-bours sup-ports pro-to-type in-tend-ed
an-ti-clas-tic go-ni-om-e-ters eu-tec-tic mis-match plat-form fam-i-lies con-ven-tion-al na-tion-al rel-a-tiv-is-tic
com-pared am-pli-tude dam-ag-ing har-mon-ics groov-ing pro-duced grav-i-ta-tion-al crys-tal-line in-fra-red
trans-par-ent im-pu-ri-ties cav-i-ties po-lar-im-e-ter po-lar-ised ex-plored al-though ga-lac-tic su-per-no-va
neg-li-gi-ble con-cen-trat-ed con-cen-trates con-cen-tric sen-si-tiv-i-ty wave-length mis-aligned elas-tic-i-ty
qual-i-fied ac-cu-rate stand-ing con-tract tech-nol-o-gies scin-til-la-tor ho-mo-ge-neous en-hanced ef-fec-tive
ac-cep-tance pro-nounced had-ron-ic iden-ti-fy ma-tri-ces pho-to-mul-ti-pli-ers feed-back align-ing sat-el-lites
col-lid-er col-lid-ers de-vel-ops down-stream con-verts en-trance pre-dict-ed ac-cept-ed con-tains ar-ranged
through-out cross-ing com-put-ed clas-si-cal in-cludes ap-proach ap-proach-es im-ple-ment-ed fin-ish-ing grind-ing
table-top pro-jec-tor sput-tered sput-ter-ing com-pres-sive in-ter-fer-om-e-ter in-ter-fer-om-e-ters in-ter-fer-om-e-try
me-trol-o-gy pro-fil-er au-to-col-li-ma-tors de-signed ad-di-tive fix-tures ma-chin-ing print-ing in-elas-tic
scat-tered se-lect-ed im-proves spac-ings re-flec-tiv-i-ty spec-tral poly-chro-mat-ic con-trast spec-trom-e-ter
spec-trom-e-ters spec-trom-e-try re-solves beam-lines to-mog-ra-phy to-mos-co-py re-con-structs cen-trif-u-gal
suc-ces-sive di-men-sion-al thou-sands il-lu-mi-nat-ed pre-pared ex-per-i-men-tal in-no-va-tors
`.trim().split(/\s+/);
