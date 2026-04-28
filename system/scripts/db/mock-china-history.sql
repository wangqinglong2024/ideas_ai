-- mock-china-history.sql
-- Seed 3 published articles under category '01' (Chinese History), each with 12 sentences.
-- Idempotent: deletes prior mock rows by article code prefix 'MOCKHIST' before re-insert.

set search_path to zhiyu, public;

with cat as (
  select id from china_categories where code = '01'
)
delete from china_articles
where code like 'MOCKHIST%'
  and category_id in (select id from cat);

do $$
declare
  v_cat uuid;
  v_a1  uuid;
  v_a2  uuid;
  v_a3  uuid;
begin
  select id into v_cat from china_categories where code = '01';
  if v_cat is null then
    raise exception 'category 01 not found';
  end if;

  -- Article 1: 秦始皇统一六国 (The First Emperor Unifies the Six States)
  insert into china_articles (code, category_id, title_pinyin, title_i18n, status)
  values (
    'MOCKHIST0001', v_cat,
    'qín shǐ huáng tǒng yī liù guó',
    jsonb_build_object(
      'zh','秦始皇统一六国',
      'en','The First Emperor Unifies the Six States',
      'vi','Tần Thủy Hoàng thống nhất sáu nước',
      'th','จิ๋นซีฮ่องเต้รวมแผ่นดิน',
      'id','Kaisar Pertama Menyatukan Enam Negara'
    ),
    'draft'
  ) returning id into v_a1;

  insert into china_sentences (article_id, seq_no, pinyin, content_zh, content_en, content_vi, content_th, content_id) values
  (v_a1, 1, 'gōng yuán qián sān shì jì, zhōng guó zhèng chǔ yú zhàn guó shí dài.', '公元前三世纪，中国正处于战国时代。', 'In the third century BCE, China was in the Warring States period.', 'Vào thế kỷ thứ ba trước Công nguyên, Trung Quốc đang ở thời Chiến Quốc.', 'ในศตวรรษที่ 3 ก่อนคริสตกาล จีนอยู่ในยุครณรัฐ', 'Pada abad ke-3 SM, Tiongkok berada di Zaman Negara-Negara Berperang.'),
  (v_a1, 2, 'dāng shí yǒu qī gè zhǔ yào de zhū hóu guó.', '当时有七个主要的诸侯国。', 'There were seven major feudal states at the time.', 'Khi ấy có bảy nước chư hầu chính.', 'ขณะนั้นมีเจ้าผู้ครองนครเจ็ดแคว้นใหญ่', 'Saat itu terdapat tujuh negara feodal utama.'),
  (v_a1, 3, 'qín guó zài shāng yāng biàn fǎ hòu zhú jiàn qiáng dà.', '秦国在商鞅变法后逐渐强大。', 'The Qin state grew strong after Shang Yang''s reforms.', 'Nước Tần dần lớn mạnh sau cuộc cải cách của Thương Ưởng.', 'แคว้นฉินเข้มแข็งขึ้นหลังการปฏิรูปของซางหยาง', 'Negara Qin menguat setelah reformasi Shang Yang.'),
  (v_a1, 4, 'yíng zhèng jí wèi hòu, lì zhì tǒng yī tiān xià.', '嬴政即位后，立志统一天下。', 'After Ying Zheng took the throne, he resolved to unify the realm.', 'Sau khi Doanh Chính lên ngôi, ông quyết tâm thống nhất thiên hạ.', 'หลังหยิ่งเจิ้งขึ้นครองราชย์ เขามุ่งมั่นรวมแผ่นดิน', 'Setelah Ying Zheng naik takhta, ia bertekad menyatukan dunia.'),
  (v_a1, 5, 'tā zhòng yòng lǐ sī, wáng jiǎn děng rén.', '他重用李斯、王翦等人。', 'He gave key roles to Li Si, Wang Jian, and others.', 'Ông trọng dụng Lý Tư, Vương Tiễn cùng những người khác.', 'เขาแต่งตั้งหลี่ซือ หวังเจี่ยน และคนอื่นๆ', 'Ia mempercayakan Li Si, Wang Jian, dan lainnya.'),
  (v_a1, 6, 'gōng yuán qián èr èr yī nián, qín miè liù guó.', '公元前二二一年，秦灭六国。', 'In 221 BCE, Qin destroyed the six states.', 'Năm 221 trước Công nguyên, Tần diệt sáu nước.', 'ปี 221 ก่อนคริสตกาล ฉินทำลายหกแคว้น', 'Pada tahun 221 SM, Qin menghancurkan enam negara.'),
  (v_a1, 7, 'yíng zhèng zì chēng shǐ huáng dì.', '嬴政自称始皇帝。', 'Ying Zheng called himself the First Emperor.', 'Doanh Chính tự xưng là Thủy Hoàng Đế.', 'หยิ่งเจิ้งสถาปนาตนเป็นจิ๋นซีฮ่องเต้', 'Ying Zheng menyebut dirinya Kaisar Pertama.'),
  (v_a1, 8, 'tā tǒng yī le wén zì, dù liàng héng hé huò bì.', '他统一了文字、度量衡和货币。', 'He standardized the script, weights, measures, and currency.', 'Ông thống nhất chữ viết, đo lường và tiền tệ.', 'เขารวมตัวอักษร มาตราชั่งวัด และเงินตรา', 'Ia menyatukan aksara, takaran, dan mata uang.'),
  (v_a1, 9, 'tā xià lìng xiū jiàn cháng chéng yǔ chí dào.', '他下令修建长城与驰道。', 'He ordered the building of the Great Wall and imperial highways.', 'Ông ra lệnh xây dựng Vạn Lý Trường Thành và đường lớn.', 'เขามีรับสั่งให้สร้างกำแพงเมืองจีนและถนนหลวง', 'Ia memerintahkan pembangunan Tembok Besar dan jalan kerajaan.'),
  (v_a1, 10, 'qín cháo shí xíng jùn xiàn zhì.', '秦朝实行郡县制。', 'The Qin dynasty implemented the commandery–county system.', 'Nhà Tần áp dụng chế độ quận huyện.', 'ราชวงศ์ฉินใช้ระบบจวินเซี่ยน', 'Dinasti Qin menerapkan sistem komandar–kabupaten.'),
  (v_a1, 11, 'rán ér yán xíng jùn fǎ yǐn fā mín yuàn.', '然而严刑峻法引发民怨。', 'However, harsh laws stirred public resentment.', 'Tuy nhiên, hình phạt khắc nghiệt gây oán giận trong dân.', 'แต่กฎหมายที่เข้มงวดสร้างความไม่พอใจ', 'Namun, hukum yang keras menimbulkan keresahan rakyat.'),
  (v_a1, 12, 'qín cháo zhǐ chí xù le shí wǔ nián jiù miè wáng le.', '秦朝只持续了十五年就灭亡了。', 'The Qin dynasty lasted only fifteen years before falling.', 'Nhà Tần chỉ kéo dài mười lăm năm rồi sụp đổ.', 'ราชวงศ์ฉินอยู่เพียงสิบห้าปีก็ล่มสลาย', 'Dinasti Qin hanya bertahan lima belas tahun sebelum runtuh.');

  -- Article 2: 丝绸之路 (The Silk Road)
  insert into china_articles (code, category_id, title_pinyin, title_i18n, status)
  values (
    'MOCKHIST0002', v_cat,
    'sī chóu zhī lù',
    jsonb_build_object(
      'zh','丝绸之路',
      'en','The Silk Road',
      'vi','Con đường Tơ lụa',
      'th','เส้นทางสายไหม',
      'id','Jalur Sutra'
    ),
    'draft'
  ) returning id into v_a2;

  insert into china_sentences (article_id, seq_no, pinyin, content_zh, content_en, content_vi, content_th, content_id) values
  (v_a2, 1, 'sī chóu zhī lù shì gǔ dài lián jiē dōng xī fāng de mào yì lù xiàn.', '丝绸之路是古代连接东西方的贸易路线。', 'The Silk Road was an ancient trade route linking East and West.', 'Con đường Tơ lụa là tuyến thương mại cổ nối Đông và Tây.', 'เส้นทางสายไหมคือเส้นทางการค้าโบราณที่เชื่อมตะวันออกกับตะวันตก', 'Jalur Sutra adalah jalur dagang kuno yang menghubungkan Timur dan Barat.'),
  (v_a2, 2, 'tā qǐ yú hàn dài, yóu zhāng qiān kāi tōng.', '它起于汉代，由张骞开通。', 'It began in the Han dynasty and was opened by Zhang Qian.', 'Nó khởi đầu từ thời Hán, do Trương Khiên khai thông.', 'มันเริ่มในสมัยฮั่น เปิดเส้นทางโดยจางเชียน', 'Jalur ini dimulai pada Dinasti Han, dibuka oleh Zhang Qian.'),
  (v_a2, 3, 'lù xiàn cóng cháng ān chū fā, xī xíng zhì luó mǎ.', '路线从长安出发，西行至罗马。', 'The route started from Chang''an and stretched west to Rome.', 'Tuyến đường khởi từ Trường An, hướng tây tới Rome.', 'เส้นทางเริ่มจากฉางอาน มุ่งตะวันตกไปจนถึงโรม', 'Rute dimulai dari Chang''an dan membentang barat hingga Roma.'),
  (v_a2, 4, 'shāng rén yùn sòng sī chóu, xiāng liào yǔ cí qì.', '商人运送丝绸、香料与瓷器。', 'Merchants transported silk, spices, and porcelain.', 'Thương nhân vận chuyển tơ lụa, hương liệu và đồ sứ.', 'พ่อค้าขนผ้าไหม เครื่องเทศ และเครื่องเคลือบ', 'Pedagang mengangkut sutra, rempah, dan porselen.'),
  (v_a2, 5, 'tā men yě dài huí le bō li, xiāng liào hé hú má.', '他们也带回了玻璃、香料和胡麻。', 'They also brought back glass, spices, and sesame.', 'Họ cũng mang về thủy tinh, hương liệu và mè.', 'พวกเขายังนำกลับแก้ว เครื่องเทศ และงา', 'Mereka juga membawa pulang kaca, rempah, dan wijen.'),
  (v_a2, 6, 'fó jiào yán zhe zhè tiáo lù chuán rù zhōng guó.', '佛教沿着这条路传入中国。', 'Buddhism entered China along this route.', 'Phật giáo theo con đường này du nhập Trung Quốc.', 'พุทธศาสนาเผยแผ่เข้าจีนตามเส้นทางนี้', 'Buddhisme masuk ke Tiongkok lewat jalur ini.'),
  (v_a2, 7, 'dūn huáng chéng wéi yī gè wén huà jiāo huì de cuǐ càn míng zhū.', '敦煌成为一个文化交汇的璀璨明珠。', 'Dunhuang became a brilliant pearl of cultural exchange.', 'Đôn Hoàng trở thành viên ngọc rực rỡ của giao thoa văn hóa.', 'ตุนหวงกลายเป็นไข่มุกแห่งการแลกเปลี่ยนวัฒนธรรม', 'Dunhuang menjadi mutiara cemerlang pertukaran budaya.'),
  (v_a2, 8, 'táng dài shí, sī chóu zhī lù dá dào dǐng shèng.', '唐代时，丝绸之路达到鼎盛。', 'In the Tang dynasty, the Silk Road reached its peak.', 'Vào thời Đường, Con đường Tơ lụa đạt đỉnh thịnh vượng.', 'ในสมัยถัง เส้นทางสายไหมรุ่งเรืองสูงสุด', 'Pada Dinasti Tang, Jalur Sutra mencapai puncaknya.'),
  (v_a2, 9, 'zhǎng ān yī shí huì jí le gè guó shāng rén.', '长安一时汇集了各国商人。', 'Chang''an once gathered merchants from many lands.', 'Trường An một thời quy tụ thương nhân khắp các nước.', 'ฉางอานครั้งหนึ่งรวมพ่อค้าจากหลายชาติ', 'Chang''an pernah dikunjungi pedagang dari banyak bangsa.'),
  (v_a2, 10, 'hǎi shàng sī chóu zhī lù yú sòng yuán shí qī xīng qǐ.', '海上丝绸之路于宋元时期兴起。', 'The maritime Silk Road rose during the Song and Yuan eras.', 'Con đường Tơ lụa trên biển hưng khởi vào thời Tống – Nguyên.', 'เส้นทางสายไหมทางทะเลรุ่งเรืองในสมัยซ่ง-หยวน', 'Jalur Sutra maritim bangkit pada era Song dan Yuan.'),
  (v_a2, 11, 'míng dài zhèng hé qī xià xī yáng tuī dòng le hǎi shàng mào yì.', '明代郑和七下西洋推动了海上贸易。', 'In the Ming dynasty, Zheng He''s seven voyages spurred maritime trade.', 'Thời Minh, bảy chuyến hải hành của Trịnh Hòa thúc đẩy thương mại biển.', 'สมัยหมิง เจิ้งเหอเดินเรือเจ็ดครั้งส่งเสริมการค้าทางทะเล', 'Pada Dinasti Ming, tujuh pelayaran Zheng He mendorong perdagangan laut.'),
  (v_a2, 12, 'jīn tiān, "yī dài yī lù" zài cì lián jiē shì jiè.', '今天，"一带一路"再次连接世界。', 'Today, the "Belt and Road" once again connects the world.', 'Ngày nay, "Vành đai và Con đường" lại kết nối thế giới.', 'วันนี้ "หนึ่งแถบ หนึ่งเส้นทาง" เชื่อมโลกอีกครั้ง', 'Hari ini, "Sabuk dan Jalan" kembali menghubungkan dunia.');

  -- Article 3: 三国演义中的赤壁之战 (The Battle of Red Cliffs in Romance of the Three Kingdoms)
  insert into china_articles (code, category_id, title_pinyin, title_i18n, status)
  values (
    'MOCKHIST0003', v_cat,
    'chì bì zhī zhàn',
    jsonb_build_object(
      'zh','赤壁之战',
      'en','The Battle of Red Cliffs',
      'vi','Trận Xích Bích',
      'th','ศึกผาแดง',
      'id','Pertempuran Tebing Merah'
    ),
    'draft'
  ) returning id into v_a3;

  insert into china_sentences (article_id, seq_no, pinyin, content_zh, content_en, content_vi, content_th, content_id) values
  (v_a3, 1, 'dōng hàn mò nián, tiān xià dà luàn.', '东汉末年，天下大乱。', 'In the late Eastern Han, the realm fell into great chaos.', 'Cuối thời Đông Hán, thiên hạ đại loạn.', 'ปลายสมัยฮั่นตะวันออก แผ่นดินวุ่นวายอย่างหนัก', 'Pada akhir Han Timur, dunia jatuh dalam kekacauan besar.'),
  (v_a3, 2, 'cáo cāo tǒng yī le běi fāng.', '曹操统一了北方。', 'Cao Cao unified the north.', 'Tào Tháo thống nhất phương Bắc.', 'โจโฉรวมแผ่นดินทางเหนือ', 'Cao Cao menyatukan wilayah utara.'),
  (v_a3, 3, 'tā lǜ lǐng dà jūn nán xià, qǐ tú tǒng yī tiān xià.', '他率领大军南下，企图统一天下。', 'He led a great army south, aiming to unify the realm.', 'Ông dẫn đại quân nam tiến, mưu thống nhất thiên hạ.', 'เขานำทัพใหญ่ลงใต้ หวังรวมแผ่นดิน', 'Ia memimpin pasukan besar ke selatan untuk menyatukan dunia.'),
  (v_a3, 4, 'liú bèi yǔ sūn quán jué dìng lián hé kàng cáo.', '刘备与孙权决定联合抗曹。', 'Liu Bei and Sun Quan decided to ally against Cao.', 'Lưu Bị và Tôn Quyền quyết định liên minh chống Tào.', 'เล่าปี่และซุนกวนตัดสินใจร่วมมือต้านโจโฉ', 'Liu Bei dan Sun Quan memutuskan beraliansi melawan Cao.'),
  (v_a3, 5, 'zhū gě liàng qián wǎng dōng wú yóu shuō sūn quán.', '诸葛亮前往东吴游说孙权。', 'Zhuge Liang traveled to Eastern Wu to persuade Sun Quan.', 'Gia Cát Lượng đến Đông Ngô thuyết phục Tôn Quyền.', 'ขงเบ้งเดินทางไปง่อก๊กเพื่อเกลี้ยกล่อมซุนกวน', 'Zhuge Liang pergi ke Wu Timur membujuk Sun Quan.'),
  (v_a3, 6, 'zhōu yú dān rèn dōng wú zhǔ shuài.', '周瑜担任东吴主帅。', 'Zhou Yu served as the chief commander of Wu.', 'Chu Du làm chủ tướng Đông Ngô.', 'จิวยี่ดำรงตำแหน่งแม่ทัพใหญ่ของง่อ', 'Zhou Yu menjabat panglima utama Wu.'),
  (v_a3, 7, 'liǎng jūn zài chì bì gé jiāng duì zhì.', '两军在赤壁隔江对峙。', 'The two armies faced off across the river at Red Cliffs.', 'Hai bên dàn trận đối diện qua sông tại Xích Bích.', 'สองทัพเผชิญหน้ากันที่ผาแดงคนละฝั่งแม่น้ำ', 'Kedua pasukan berhadapan di Tebing Merah dipisahkan sungai.'),
  (v_a3, 8, 'cáo jūn duō bèi fāng rén, bù xí shuǐ zhàn.', '曹军多北方人，不习水战。', 'Cao''s troops were mostly northerners, unaccustomed to naval warfare.', 'Quân Tào đa phần người phương Bắc, không quen thủy chiến.', 'ทหารโจโฉส่วนใหญ่เป็นชาวเหนือ ไม่ชำนาญรบทางน้ำ', 'Pasukan Cao kebanyakan orang utara, tak terbiasa perang air.'),
  (v_a3, 9, 'zhōu yú yǔ huáng gài shè jì zhà jiàng.', '周瑜与黄盖设计诈降。', 'Zhou Yu and Huang Gai devised a feigned-surrender plan.', 'Chu Du và Hoàng Cái bày kế trá hàng.', 'จิวยี่กับฮองกายวางแผนแสร้งยอมแพ้', 'Zhou Yu dan Huang Gai menyusun siasat pura-pura menyerah.'),
  (v_a3, 10, 'huáng gài lǜ huǒ chuán chōng xiàng cáo jūn shuǐ zhài.', '黄盖率火船冲向曹军水寨。', 'Huang Gai led fire ships against Cao''s naval camp.', 'Hoàng Cái dẫn thuyền lửa lao vào trại thủy của Tào.', 'ฮองกายนำเรือเพลิงพุ่งชนค่ายเรือของโจโฉ', 'Huang Gai memimpin kapal api menabrak markas laut Cao.'),
  (v_a3, 11, 'dōng fēng dà qǐ, huǒ shì xùn měng.', '东风大起，火势迅猛。', 'A strong east wind rose, and the flames spread fiercely.', 'Gió đông nổi mạnh, lửa lan dữ dội.', 'ลมตะวันออกพัดแรง เปลวไฟลุกลามรวดเร็ว', 'Angin timur meniup kencang, api menjalar dahsyat.'),
  (v_a3, 12, 'cáo jūn dà bài, sān guó dǐng lì de jú miàn xíng chéng.', '曹军大败，三国鼎立的局面形成。', 'Cao''s army was crushed, and the Three Kingdoms balance took shape.', 'Quân Tào đại bại, cục diện Tam Quốc chia ba được hình thành.', 'ทัพโจโฉพ่ายยับ เกิดดุลสามก๊ก', 'Pasukan Cao kalah telak, terbentuklah keseimbangan Tiga Kerajaan.');

  -- Publish all three via RPC (validates >=1 sentence and sets published_at)
  perform fn_publish_article(v_a1);
  perform fn_publish_article(v_a2);
  perform fn_publish_article(v_a3);
end $$;

-- Quick verification
select code, status, published_at is not null as has_pub
  from china_articles where code like 'MOCKHIST%' order by code;
