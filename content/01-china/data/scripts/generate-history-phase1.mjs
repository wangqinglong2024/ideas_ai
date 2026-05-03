#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../../../..');
const legacyDir = path.join(repoRoot, 'content/01-china/data/articles/01-history');
const outputDir = path.join(legacyDir, 'phase1');
const generatedAt = '2026-05-03T00:00:00+08:00';

const topics = [
  topic('a01', '01-dynasty-order-rhyme', 'zhōng guó cháo dài shùn xù kǒu jué lǐ jiǎng le shén me', {
    zh: '中国朝代顺序口诀里讲了什么？', en: 'Chinese Dynasty Order Rhyme', vi: 'Câu vè triều đại Trung Quốc', th: 'กลอนลำดับราชวงศ์จีน', id: 'Rima Urutan Dinasti Tiongkok',
  }, {
    zh: '中国朝代顺序口诀用固定顺序帮助学习者记住主要王朝。',
    pinyin: 'zhōng guó cháo dài shùn xù kǒu jué yòng gù dìng shùn xù bāng zhù xué xí zhě jì zhù zhǔ yào wáng cháo',
    en: 'The Chinese dynasty order rhyme helps learners remember the main dynasties in a fixed sequence.',
    vi: 'Câu vè thứ tự triều đại Trung Quốc giúp người học ghi nhớ các triều đại chính theo trình tự cố định.',
    th: 'กลอนลำดับราชวงศ์จีนช่วยให้ผู้เรียนจำราชวงศ์หลักตามลำดับที่แน่นอน',
    id: 'Rima urutan dinasti Tiongkok membantu pelajar mengingat dinasti utama dalam urutan tetap.',
  }, ['Chinese dynasty order', 'Chinese history timeline', 'Xia Shang Zhou Qin Han'], ['夏商周', '秦汉', '隋唐宋元明清'], [
    fact('夏商周秦汉是口诀的开头。', 'xià shāng zhōu qín hàn shì kǒu jué de kāi tóu', 'Xia, Shang, Zhou, Qin, and Han open the rhyme.', 'Hạ, Thương, Chu, Tần, Hán là phần mở đầu của câu vè.', 'เซี่ย ซาง โจว ฉิน ฮั่นเป็นช่วงเปิดของกลอน', 'Xia, Shang, Zhou, Qin, dan Han menjadi pembuka rima.'),
    fact('三国两晋南北朝概括了长期分裂。', 'sān guó liǎng jìn nán běi cháo gài kuò le cháng qī fēn liè', 'The Three Kingdoms, Two Jin, and Northern-Southern Dynasties summarize long division.', 'Tam Quốc, Lưỡng Tấn và Nam Bắc triều tóm lược thời kỳ chia cắt dài.', 'สามก๊ก สองจิ้น และราชวงศ์เหนือใต้สรุปยุคแบ่งแยกยาวนาน', 'Tiga Kerajaan, Dua Jin, dan Dinasti Utara-Selatan merangkum perpecahan panjang.'),
    fact('隋唐五代宋连接了统一和繁荣。', 'suí táng wǔ dài sòng lián jiē le tǒng yī hé fán róng', 'Sui, Tang, Five Dynasties, and Song connect reunification with prosperity.', 'Tùy, Đường, Ngũ Đại và Tống nối liền thống nhất với thịnh vượng.', 'สุย ถัง ห้าราชวงศ์ และซ่งเชื่อมการรวมแผ่นดินกับความรุ่งเรือง', 'Sui, Tang, Lima Dinasti, dan Song menghubungkan penyatuan dengan kemakmuran.'),
    fact('元明清是口诀的最后三个大朝代。', 'yuán míng qīng shì kǒu jué de zuì hòu sān gè dà cháo dài', 'Yuan, Ming, and Qing are the last three major dynasties in the rhyme.', 'Nguyên, Minh, Thanh là ba triều đại lớn cuối cùng trong câu vè.', 'หยวน หมิง ชิงคือสามราชวงศ์ใหญ่สุดท้ายในกลอน', 'Yuan, Ming, dan Qing adalah tiga dinasti besar terakhir dalam rima.'),
    fact('口诀适合做中国历史入门索引。', 'kǒu jué shì hé zuò zhōng guó lì shǐ rù mén suǒ yǐn', 'The rhyme works as an entry index for Chinese history.', 'Câu vè phù hợp làm chỉ mục nhập môn lịch sử Trung Quốc.', 'กลอนนี้เหมาะเป็นดัชนีเริ่มต้นของประวัติศาสตร์จีน', 'Rima ini cocok menjadi indeks awal sejarah Tiongkok.'),
    fact('学习朝代顺序有助于理解人物和事件。', 'xué xí cháo dài shùn xù yǒu zhù yú lǐ jiě rén wù hé shì jiàn', 'Learning dynasty order helps explain people and events.', 'Học thứ tự triều đại giúp hiểu nhân vật và sự kiện.', 'การเรียนลำดับราชวงศ์ช่วยเข้าใจบุคคลและเหตุการณ์', 'Mempelajari urutan dinasti membantu memahami tokoh dan peristiwa.'),
  ], ['夏朝', '商朝', '周朝', '秦朝', '汉朝', '唐朝', '宋朝', '元朝', '明朝', '清朝']),
  topic('a02', '02-qin-shi-huang-unification', 'qín shǐ huáng tǒng yī zhōng guó zuò le nǎ xiē shì', {
    zh: '秦始皇统一中国做了哪些事？', en: 'Qin Shi Huang Unification', vi: 'Tần Thủy Hoàng thống nhất', th: 'จิ๋นซีฮ่องเต้รวมจีน', id: 'Penyatuan Qin Shi Huang',
  }, {
    zh: '秦始皇通过灭六国和统一制度建立了中国第一个中央集权帝国。', pinyin: 'qín shǐ huáng tōng guò miè liù guó hé tǒng yī zhì dù jiàn lì le zhōng guó dì yī gè zhōng yāng jí quán dì guó',
    en: 'Qin Shi Huang built China’s first centralized empire by conquering six states and standardizing systems.', vi: 'Tần Thủy Hoàng lập đế quốc tập quyền đầu tiên của Trung Quốc bằng cách diệt sáu nước và thống nhất制度.', th: 'จิ๋นซีฮ่องเต้สร้างจักรวรรดิรวมศูนย์แรกของจีนด้วยการพิชิตหกแคว้นและรวมระบบ', id: 'Qin Shi Huang membangun kekaisaran terpusat pertama Tiongkok dengan menaklukkan enam negara dan menyeragamkan sistem.',
  }, ['Qin Shi Huang', 'first emperor of China', 'Terracotta Army'], ['秦始皇', '郡县制', '兵马俑'], [
    fact('秦在公元前221年完成统一。', 'qín zài gōng yuán qián èr èr yī nián wán chéng tǒng yī', 'Qin completed unification in 221 BCE.', 'Tần hoàn thành thống nhất năm 221 trước Công nguyên.', 'ฉินรวมแผ่นดินสำเร็จในปี 221 ก่อนคริสตกาล', 'Qin menyelesaikan penyatuan pada 221 SM.'),
    fact('皇帝称号从秦始皇开始使用。', 'huáng dì chēng hào cóng qín shǐ huáng kāi shǐ shǐ yòng', 'The title emperor began with Qin Shi Huang.', 'Danh hiệu hoàng đế bắt đầu từ Tần Thủy Hoàng.', 'ตำแหน่งจักรพรรดิเริ่มใช้จากจิ๋นซีฮ่องเต้', 'Gelar kaisar mulai dipakai sejak Qin Shi Huang.'),
    fact('小篆成为统一文字的标准。', 'xiǎo zhuàn chéng wéi tǒng yī wén zì de biāo zhǔn', 'Small Seal Script became the standard script.', 'Tiểu triện trở thành chuẩn chữ viết thống nhất.', 'อักษรเสี่ยวจ้วนกลายเป็นมาตรฐานตัวเขียน', 'Aksara Segel Kecil menjadi standar tulisan.'),
    fact('郡县制让中央直接管理地方。', 'jùn xiàn zhì ràng zhōng yāng zhí jiē guǎn lǐ dì fāng', 'The commandery-county system let the center govern local areas directly.', 'Chế độ quận huyện giúp trung ương quản lý địa phương trực tiếp.', 'ระบบจวิ้นเซี่ยนทำให้ส่วนกลางปกครองท้องถิ่นโดยตรง', 'Sistem komanderi-kabupaten membuat pusat mengelola daerah langsung.'),
    fact('圆形方孔钱统一了货币。', 'yuán xíng fāng kǒng qián tǒng yī le huò bì', 'Round coins with square holes standardized currency.', 'Đồng tiền tròn lỗ vuông thống nhất tiền tệ.', 'เหรียญกลมรูเหลี่ยมทำให้เงินตราเป็นมาตรฐาน', 'Koin bundar berlubang persegi menyeragamkan mata uang.'),
    fact('兵马俑让秦始皇陵成为世界热点。', 'bīng mǎ yǒng ràng qín shǐ huáng líng chéng wéi shì jiè rè diǎn', 'The Terracotta Army made his mausoleum a world-famous site.', 'Binh mã dũng khiến lăng Tần Thủy Hoàng thành điểm nổi tiếng thế giới.', 'กองทัพทหารดินเผาทำให้สุสานจิ๋นซีโด่งดังทั่วโลก', 'Pasukan Terakota membuat makam Qin Shi Huang terkenal di dunia.'),
  ], ['秦始皇', '李斯', '蒙恬', '兵马俑', '长城', '郡县制']),
  topic('a03', '03-zhang-qian-western-regions', 'hàn wǔ dì wèi shén me pài zhāng qiān chū shǐ xī yù', {
    zh: '汉武帝为什么派张骞出使西域？', en: 'Why Zhang Qian Went West', vi: 'Vì sao Trương Khiên đi Tây Vực', th: 'เหตุผลที่จางเชียนไปตะวันตก', id: 'Mengapa Zhang Qian ke Barat',
  }, {
    zh: '汉武帝派张骞出使西域，是为了寻找盟友并打开通往中亚的通道。', pinyin: 'hàn wǔ dì pài zhāng qiān chū shǐ xī yù shì wèi le xún zhǎo méng yǒu bìng dǎ kāi tōng wǎng zhōng yà de tōng dào',
    en: 'Emperor Han Wu sent Zhang Qian west to seek allies and open routes to Central Asia.', vi: 'Hán Vũ Đế phái Trương Khiên đi Tây Vực để tìm đồng minh và mở đường sang Trung Á.', th: 'จักรพรรดิฮั่นอู่ส่งจางเชียนไปตะวันตกเพื่อหาพันธมิตรและเปิดทางสู่เอเชียกลาง', id: 'Kaisar Han Wu mengirim Zhang Qian ke barat untuk mencari sekutu dan membuka jalur ke Asia Tengah.',
  }, ['Zhang Qian', 'Western Regions', 'Silk Road origin'], ['张骞', '西域', '丝绸之路'], [
    fact('张骞第一次出使始于公元前138年。', 'zhāng qiān dì yī cì chū shǐ shǐ yú gōng yuán qián yī sān bā nián', 'Zhang Qian’s first mission began in 138 BCE.', 'Chuyến đi sứ đầu tiên của Trương Khiên bắt đầu năm 138 TCN.', 'ภารกิจแรกของจางเชียนเริ่มในปี 138 ก่อนคริสตกาล', 'Misi pertama Zhang Qian dimulai pada 138 SM.'),
    fact('他的目标是联络大月氏。', 'tā de mù biāo shì lián luò dà yuè zhī', 'His goal was to contact the Yuezhi.', 'Mục tiêu của ông là liên lạc với Đại Nguyệt Chi.', 'เป้าหมายของเขาคือติดต่อชาวเยว่จือ', 'Tujuannya adalah menghubungi Yuezhi.'),
    fact('他曾被匈奴扣留多年。', 'tā céng bèi xiōng nú kòu liú duō nián', 'He was detained by the Xiongnu for many years.', 'Ông từng bị Hung Nô giữ lại nhiều năm.', 'เขาเคยถูกซยงหนูกักตัวหลายปี', 'Ia pernah ditahan Xiongnu selama bertahun-tahun.'),
    fact('军事同盟没有达成，但地理信息非常宝贵。', 'jūn shì tóng méng méi yǒu dá chéng dàn dì lǐ xìn xī fēi cháng bǎo guì', 'The alliance failed, but the geographic intelligence was valuable.', 'Liên minh quân sự thất bại nhưng thông tin địa lý rất quý.', 'พันธมิตรทหารไม่สำเร็จแต่ข้อมูลภูมิศาสตร์มีค่ามาก', 'Aliansi militer gagal, tetapi informasi geografisnya sangat berharga.'),
    fact('张骞被视为丝绸之路开拓者。', 'zhāng qiān bèi shì wéi sī chóu zhī lù kāi tuò zhě', 'Zhang Qian is regarded as a pioneer of the Silk Road.', 'Trương Khiên được xem là người mở đường Tơ lụa.', 'จางเชียนถูกมองว่าเป็นผู้บุกเบิกเส้นทางสายไหม', 'Zhang Qian dipandang sebagai perintis Jalur Sutra.'),
    fact('西域信息改变了汉朝的战略视野。', 'xī yù xìn xī gǎi biàn le hàn cháo de zhàn lüè shì yě', 'Knowledge of the Western Regions changed Han strategy.', 'Thông tin Tây Vực thay đổi tầm nhìn chiến lược của nhà Hán.', 'ข้อมูลดินแดนตะวันตกเปลี่ยนมุมมองยุทธศาสตร์ของฮั่น', 'Informasi Wilayah Barat mengubah wawasan strategi Han.'),
  ], ['汉武帝', '张骞', '大月氏', '匈奴', '西域', '长安']),
  topic('a04', '04-silk-road-opening', 'sī chóu zhī lù shì zěn me kāi tōng de', {
    zh: '丝绸之路是怎么开通的？', en: 'How the Silk Road Opened', vi: 'Con đường Tơ lụa mở ra thế nào', th: 'เส้นทางสายไหมเปิดอย่างไร', id: 'Bagaimana Jalur Sutra Dibuka',
  }, {
    zh: '丝绸之路是在汉朝外交、边疆经营和商贸往来中逐渐形成的。', pinyin: 'sī chóu zhī lù shì zài hàn cháo wài jiāo biān jiāng jīng yíng hé shāng mào wǎng lái zhōng zhú jiàn xíng chéng de',
    en: 'The Silk Road formed gradually through Han diplomacy, frontier policy, and trade.', vi: 'Con đường Tơ lụa dần hình thành qua ngoại giao, quản lý biên cương và thương mại thời Hán.', th: 'เส้นทางสายไหมค่อย ๆ ก่อตัวจากการทูต การจัดการชายแดน และการค้าในยุคฮั่น', id: 'Jalur Sutra terbentuk bertahap lewat diplomasi Han, kebijakan perbatasan, dan perdagangan.',
  }, ['Silk Road', 'ancient trade route', 'Chang’an to Central Asia'], ['丝绸之路', '长安', '敦煌'], [
    fact('丝绸之路不是一条单线道路。', 'sī chóu zhī lù bù shì yī tiáo dān xiàn dào lù', 'The Silk Road was not a single road.', 'Con đường Tơ lụa không phải một tuyến đường duy nhất.', 'เส้นทางสายไหมไม่ใช่ถนนเส้นเดียว', 'Jalur Sutra bukan satu jalan tunggal.'),
    fact('长安是重要起点。', 'cháng ān shì zhòng yào qǐ diǎn', 'Chang’an was an important starting point.', 'Trường An là điểm khởi đầu quan trọng.', 'ฉางอันเป็นจุดเริ่มต้นสำคัญ', 'Chang’an adalah titik awal penting.'),
    fact('敦煌是中转和文化交流节点。', 'dūn huáng shì zhōng zhuǎn hé wén huà jiāo liú jié diǎn', 'Dunhuang was a transit and cultural exchange hub.', 'Đôn Hoàng là điểm trung chuyển và giao lưu văn hóa.', 'ตุนหวงเป็นจุดพักและแลกเปลี่ยนวัฒนธรรม', 'Dunhuang adalah simpul transit dan pertukaran budaya.'),
    fact('丝绸、茶叶和瓷器向西传播。', 'sī chóu chá yè hé cí qì xiàng xī chuán bō', 'Silk, tea, and porcelain moved westward.', 'Tơ lụa, trà và đồ sứ truyền sang phía tây.', 'ผ้าไหม ชา และเครื่องเคลือบแพร่ไปทางตะวันตก', 'Sutra, teh, dan porselen menyebar ke barat.'),
    fact('葡萄、香料和玻璃器也传入中国。', 'pú táo xiāng liào hé bō li qì yě chuán rù zhōng guó', 'Grapes, spices, and glassware entered China.', 'Nho, hương liệu và đồ thủy tinh cũng vào Trung Quốc.', 'องุ่น เครื่องเทศ และเครื่องแก้วก็เข้าสู่จีน', 'Anggur, rempah, dan barang kaca juga masuk Tiongkok.'),
    fact('海上丝路后来变得同样重要。', 'hǎi shàng sī lù hòu lái biàn de tóng yàng zhòng yào', 'The maritime route later became equally important.', 'Tuyến đường biển về sau cũng trở nên quan trọng.', 'เส้นทางทะเลต่อมาก็สำคัญไม่แพ้กัน', 'Jalur laut kemudian menjadi sama pentingnya.'),
  ], ['长安', '敦煌', '楼兰', '撒马尔罕', '罗马', '广州']),
  topic('a05', '05-three-kingdoms-formation', 'sān guó shí qī de wèi shǔ wú shì zěn me xíng chéng de', {
    zh: '三国时期的魏蜀吴是怎么形成的？', en: 'How Wei Shu Wu Formed', vi: 'Ngụy Thục Ngô hình thành', th: 'เว่ย สู่ อู๋ก่อตัวอย่างไร', id: 'Terbentuknya Wei Shu Wu',
  }, {
    zh: '魏蜀吴是在东汉末年军阀混战后形成的三个割据政权。', pinyin: 'wèi shǔ wú shì zài dōng hàn mò nián jūn fá hùn zhàn hòu xíng chéng de sān gè gē jù zhèng quán',
    en: 'Wei, Shu, and Wu were three regimes formed after late Eastern Han warlord conflicts.', vi: 'Ngụy, Thục, Ngô là ba chính quyền hình thành sau hỗn chiến quân phiệt cuối Đông Hán.', th: 'เว่ย สู่ และอู๋คือสามรัฐที่เกิดหลังศึกขุนศึกปลายฮั่นตะวันออก', id: 'Wei, Shu, dan Wu adalah tiga rezim setelah konflik panglima perang akhir Han Timur.',
  }, ['Three Kingdoms', 'Wei Shu Wu', 'Battle of Red Cliffs'], ['三国', '魏蜀吴', '赤壁之战'], [
    fact('黄巾起义削弱了东汉朝廷。', 'huáng jīn qǐ yì xuē ruò le dōng hàn cháo tíng', 'The Yellow Turban Rebellion weakened the Eastern Han court.', 'Khởi nghĩa Khăn Vàng làm triều đình Đông Hán suy yếu.', 'กบฏโพกผ้าเหลืองทำให้ราชสำนักฮั่นตะวันออกอ่อนแอ', 'Pemberontakan Sorban Kuning melemahkan istana Han Timur.'),
    fact('曹操逐渐控制北方。', 'cáo cāo zhú jiàn kòng zhì běi fāng', 'Cao Cao gradually controlled the north.', 'Tào Tháo dần kiểm soát phương Bắc.', 'โจโฉค่อย ๆ ควบคุมภาคเหนือ', 'Cao Cao perlahan menguasai utara.'),
    fact('赤壁之战阻止了曹操南下统一。', 'chì bì zhī zhàn zǔ zhǐ le cáo cāo nán xià tǒng yī', 'Red Cliffs stopped Cao Cao from unifying the south.', 'Xích Bích ngăn Tào Tháo thống nhất phương nam.', 'ศึกผาแดงหยุดโจโฉไม่ให้รวมแดนใต้', 'Tebing Merah menghentikan Cao Cao menyatukan selatan.'),
    fact('曹丕在220年建立魏。', 'cáo pī zài èr èr líng nián jiàn lì wèi', 'Cao Pi founded Wei in 220.', 'Tào Phi lập nước Ngụy năm 220.', 'โจผีตั้งเว่ยในปี 220', 'Cao Pi mendirikan Wei pada 220.'),
    fact('刘备在221年建立蜀。', 'liú bèi zài èr èr yī nián jiàn lì shǔ', 'Liu Bei founded Shu in 221.', 'Lưu Bị lập Thục năm 221.', 'เล่าปี่ตั้งสู่ในปี 221', 'Liu Bei mendirikan Shu pada 221.'),
    fact('孙权在229年建立吴。', 'sūn quán zài èr èr jiǔ nián jiàn lì wú', 'Sun Quan founded Wu in 229.', 'Tôn Quyền lập Ngô năm 229.', 'ซุนกวนตั้งอู๋ในปี 229', 'Sun Quan mendirikan Wu pada 229.'),
  ], ['曹操', '刘备', '孙权', '诸葛亮', '赤壁', '司马懿']),
  topic('a06', '06-great-tang-era', 'táng cháo wèi shén me bèi chēng wéi dà táng shèng shì', {
    zh: '唐朝为什么被称为大唐盛世？', en: 'Why Tang Was a Golden Age', vi: 'Vì sao Đường thịnh thế', th: 'เหตุใดถังเป็นยุครุ่งเรือง', id: 'Mengapa Tang Zaman Emas',
  }, {
    zh: '唐朝被称为大唐盛世，是因为它在政治、经济、文化和国际交流上都很强盛。', pinyin: 'táng cháo bèi chēng wéi dà táng shèng shì shì yīn wèi tā zài zhèng zhì jīng jì wén huà hé guó jì jiāo liú shàng dōu hěn qiáng shèng',
    en: 'The Tang is called a golden age because politics, economy, culture, and exchange were all strong.', vi: 'Nhà Đường được gọi là thịnh thế vì chính trị, kinh tế, văn hóa và giao lưu quốc tế đều mạnh.', th: 'ถังถูกเรียกว่ายุครุ่งเรืองเพราะการเมือง เศรษฐกิจ วัฒนธรรม และการแลกเปลี่ยนล้วนเข้มแข็ง', id: 'Tang disebut zaman emas karena politik, ekonomi, budaya, dan pertukaran internasionalnya kuat.',
  }, ['Tang dynasty', 'Tang golden age', 'Chang’an'], ['唐朝', '大唐盛世', '长安'], [
    fact('唐朝从618年延续到907年。', 'táng cháo cóng liù yī bā nián yán xù dào jiǔ líng qī nián', 'The Tang lasted from 618 to 907.', 'Nhà Đường kéo dài từ 618 đến 907.', 'ราชวงศ์ถังอยู่ตั้งแต่ปี 618 ถึง 907', 'Tang berlangsung dari 618 hingga 907.'),
    fact('贞观之治体现了早期治理能力。', 'zhēn guān zhī zhì tǐ xiàn le zǎo qī zhì lǐ néng lì', 'The Zhenguan era showed early governance strength.', 'Trinh Quán chi trị thể hiện năng lực trị quốc ban đầu.', 'ยุคเจินกวนแสดงความสามารถการปกครองระยะแรก', 'Era Zhenguan menunjukkan kekuatan tata kelola awal.'),
    fact('开元盛世代表唐朝高峰。', 'kāi yuán shèng shì dài biǎo táng cháo gāo fēng', 'The Kaiyuan era marked Tang’s peak.', 'Khai Nguyên thịnh thế đại diện đỉnh cao nhà Đường.', 'ไคหยวนคือจุดสูงสุดของถัง', 'Era Kaiyuan menandai puncak Tang.'),
    fact('长安是国际化大城市。', 'cháng ān shì guó jì huà dà chéng shì', 'Chang’an was an international metropolis.', 'Trường An là đô thị quốc tế.', 'ฉางอันเป็นมหานครนานาชาติ', 'Chang’an adalah kota metropolitan internasional.'),
    fact('唐诗成为中国文学高峰。', 'táng shī chéng wéi zhōng guó wén xué gāo fēng', 'Tang poetry became a peak of Chinese literature.', 'Đường thi trở thành đỉnh cao văn học Trung Hoa.', 'กวีนิพนธ์ถังเป็นยอดสูงของวรรณกรรมจีน', 'Puisi Tang menjadi puncak sastra Tiongkok.'),
    fact('安史之乱后唐朝由盛转衰。', 'ān shǐ zhī luàn hòu táng cháo yóu shèng zhuǎn shuāi', 'After the An Lushan Rebellion, Tang declined.', 'Sau loạn An Sử, nhà Đường chuyển từ thịnh sang suy.', 'หลังกบฏอันสื่อ ถังเริ่มจากรุ่งสู่เสื่อม', 'Setelah Pemberontakan An Lushan, Tang menurun.'),
  ], ['唐太宗', '武则天', '唐玄宗', '长安', '李白', '杜甫']),
  topic('a07', '07-xuanzang-journey', 'xuán zàng xī xíng qǔ jīng de zhēn shí gù shi', {
    zh: '玄奘西行取经的真实故事', en: 'Xuanzang’s Real Journey', vi: 'Hành trình thật của Huyền Trang', th: 'การเดินทางจริงของพระถังซัมจั๋ง', id: 'Perjalanan Nyata Xuanzang',
  }, {
    zh: '玄奘西行取经是真实的唐代求法旅行，后来才演变成西游记故事。', pinyin: 'xuán zàng xī xíng qǔ jīng shì zhēn shí de táng dài qiú fǎ lǚ xíng hòu lái cái yǎn biàn chéng xī yóu jì gù shi',
    en: 'Xuanzang’s journey was a real Tang pilgrimage that later inspired Journey to the West.', vi: 'Chuyến đi thỉnh kinh của Huyền Trang là hành trình cầu pháp có thật thời Đường, sau thành Tây Du Ký.', th: 'การไปอัญเชิญพระไตรปิฎกของพระถังซัมจั๋งเป็นเรื่องจริงยุคถัง ก่อนกลายเป็นไซอิ๋ว', id: 'Perjalanan Xuanzang adalah ziarah nyata era Tang yang kemudian mengilhami Perjalanan ke Barat.',
  }, ['Xuanzang', 'Journey to the West real story', 'Buddhist scriptures'], ['玄奘', '西游记', '大唐西域记'], [
    fact('玄奘生活在唐朝初年。', 'xuán zàng shēng huó zài táng cháo chū nián', 'Xuanzang lived in the early Tang.', 'Huyền Trang sống vào đầu thời Đường.', 'พระถังซัมจั๋งมีชีวิตในต้นราชวงศ์ถัง', 'Xuanzang hidup pada awal Dinasti Tang.'),
    fact('他为了佛经原典前往印度。', 'tā wèi le fó jīng yuán diǎn qián wǎng yìn dù', 'He went to India for original Buddhist texts.', 'Ông đến Ấn Độ để tìm kinh Phật nguyên bản.', 'เขาไปอินเดียเพื่อค้นหาคัมภีร์พุทธต้นฉบับ', 'Ia pergi ke India mencari naskah Buddha asli.'),
    fact('那烂陀寺是他重要的学习地点。', 'nà làn tuó sì shì tā zhòng yào de xué xí dì diǎn', 'Nalanda was an important place of study for him.', 'Nalanda là nơi học tập quan trọng của ông.', 'นาลันทาเป็นสถานที่ศึกษาสำคัญของเขา', 'Nalanda adalah tempat belajar penting baginya.'),
    fact('他带回了大量佛经。', 'tā dài huí le dà liàng fó jīng', 'He brought back many Buddhist scriptures.', 'Ông mang về nhiều kinh Phật.', 'เขานำพระคัมภีร์กลับมาจำนวนมาก', 'Ia membawa pulang banyak kitab Buddha.'),
    fact('大唐西域记记录了沿途见闻。', 'dà táng xī yù jì jì lù le yán tú jiàn wén', 'Great Tang Records on the Western Regions recorded what he saw.', 'Đại Đường Tây Vực Ký ghi lại điều ông thấy trên đường.', 'ต้าถังซีอวี่จี้บันทึกสิ่งที่เขาพบระหว่างทาง', 'Catatan Wilayah Barat Tang Agung merekam pengamatannya.'),
    fact('西游记把真实旅程文学化了。', 'xī yóu jì bǎ zhēn shí lǚ chéng wén xué huà le', 'Journey to the West turned the real trip into literature.', 'Tây Du Ký văn học hóa hành trình có thật.', 'ไซอิ๋วทำให้การเดินทางจริงกลายเป็นวรรณกรรม', 'Perjalanan ke Barat mengubah perjalanan nyata menjadi sastra.'),
  ], ['玄奘', '长安', '那烂陀寺', '印度', '大唐西域记', '西游记']),
  topic('a08', '08-song-economy-military', 'sòng cháo wèi shén me jīng jì fā dá què jūn shì ruò', {
    zh: '宋朝为什么经济发达却军事弱？', en: 'Rich Song, Weak Military', vi: 'Tống giàu nhưng quân yếu', th: 'ซ่งมั่งคั่งแต่ทหารอ่อน', id: 'Song Kaya tetapi Militer Lemah',
  }, {
    zh: '宋朝经济发达却军事偏弱，核心原因是重文轻武和外部压力长期并存。', pinyin: 'sòng cháo jīng jì fā dá què jūn shì piān ruò hé xīn yuán yīn shì zhòng wén qīng wǔ hé wài bù yā lì cháng qī bìng cún',
    en: 'The Song was rich but militarily weaker because civil governance and external pressure coexisted for a long time.', vi: 'Nhà Tống giàu nhưng quân sự yếu vì trọng văn khinh võ cùng áp lực bên ngoài kéo dài.', th: 'ซ่งเศรษฐกิจรุ่งแต่ทหารอ่อนเพราะเน้นฝ่ายพลเรือนและมีแรงกดดันภายนอกยาวนาน', id: 'Song kaya tetapi militernya lemah karena pemerintahan sipil dan tekanan luar berlangsung lama.',
  }, ['Song dynasty economy', 'why Song military weak', 'Chinese civil service'], ['宋朝经济', '重文轻武', '交子'], [
    fact('宋朝商业和城市经济非常活跃。', 'sòng cháo shāng yè hé chéng shì jīng jì fēi cháng huó yuè', 'Song commerce and urban economy were very active.', 'Thương mại và kinh tế đô thị thời Tống rất sôi động.', 'การค้าและเศรษฐกิจเมืองยุคซ่งคึกคักมาก', 'Perdagangan dan ekonomi kota Song sangat aktif.'),
    fact('交子被视为早期纸币。', 'jiāo zǐ bèi shì wéi zǎo qī zhǐ bì', 'Jiaozi is seen as early paper money.', 'Giao tử được xem là tiền giấy sơ khai.', 'เจียวจื่อถูกมองว่าเป็นเงินกระดาษยุคแรก', 'Jiaozi dipandang sebagai uang kertas awal.'),
    fact('科举扩大了士人官僚群体。', 'kē jǔ kuò dà le shì rén guān liáo qún tǐ', 'Exams expanded the scholar-official class.', 'Khoa cử mở rộng tầng lớp sĩ đại phu.', 'การสอบขยายชนชั้นขุนนางนักปราชญ์', 'Ujian memperluas kelas sarjana-pejabat.'),
    fact('重文轻武限制了武将权力。', 'zhòng wén qīng wǔ xiàn zhì le wǔ jiàng quán lì', 'Valuing civil officials limited military commanders.', 'Trọng văn khinh võ hạn chế quyền võ tướng.', 'การเน้นพลเรือนจำกัดอำนาจแม่ทัพ', 'Mengutamakan sipil membatasi kuasa jenderal.'),
    fact('辽、西夏和金长期施压。', 'liáo xī xià hé jīn cháng qī shī yā', 'Liao, Western Xia, and Jin exerted long pressure.', 'Liêu, Tây Hạ và Kim gây áp lực lâu dài.', 'เหลียว ซีเซี่ย และจินกดดันยาวนาน', 'Liao, Xia Barat, dan Jin memberi tekanan lama.'),
    fact('宋词和绘画代表高度文化成就。', 'sòng cí hé huì huà dài biǎo gāo dù wén huà chéng jiù', 'Song lyrics and painting show high cultural achievement.', 'Tống từ và hội họa thể hiện thành tựu văn hóa cao.', 'กวีนิพนธ์ซ่งและจิตรกรรมแสดงความสำเร็จวัฒนธรรมสูง', 'Lirik Song dan lukisan menunjukkan capaian budaya tinggi.'),
  ], ['宋朝', '汴京', '临安', '交子', '辽', '金']),
  topic('a09', '09-mongol-empire-yuan', 'měng gǔ dì guó shì zěn me jiàn lì yuán cháo de', {
    zh: '蒙古帝国是怎么建立元朝的？', en: 'Mongols and the Yuan', vi: 'Mông Cổ lập nhà Nguyên', th: 'มองโกลสร้างหยวนอย่างไร', id: 'Mongol Mendirikan Yuan',
  }, {
    zh: '蒙古帝国通过草原统一、军事扩张和忽必烈建制，最终建立元朝。', pinyin: 'měng gǔ dì guó tōng guò cǎo yuán tǒng yī jūn shì kuò zhāng hé hū bì liè jiàn zhì zuì zhōng jiàn lì yuán cháo',
    en: 'The Mongol Empire founded Yuan through steppe unification, expansion, and Kublai Khan’s state-building.', vi: 'Đế quốc Mông Cổ lập Nguyên nhờ thống nhất thảo nguyên, mở rộng quân sự và xây dựng nhà nước của Hốt Tất Liệt.', th: 'จักรวรรดิมองโกลตั้งหยวนผ่านการรวมทุ่งหญ้า การขยายทัพ และการสร้างรัฐของกุบไลข่าน', id: 'Kekaisaran Mongol mendirikan Yuan lewat penyatuan stepa, ekspansi, dan pembentukan negara oleh Kublai Khan.',
  }, ['Mongol Empire', 'Yuan dynasty', 'Kublai Khan'], ['蒙古帝国', '元朝', '忽必烈'], [
    fact('成吉思汗统一了蒙古诸部。', 'chéng jí sī hán tǒng yī le měng gǔ zhū bù', 'Genghis Khan unified Mongol tribes.', 'Thành Cát Tư Hãn thống nhất các bộ Mông Cổ.', 'เจงกิสข่านรวมเผ่ามองโกล', 'Jenghis Khan menyatukan suku-suku Mongol.'),
    fact('蒙古骑兵机动能力很强。', 'měng gǔ qí bīng jī dòng néng lì hěn qiáng', 'Mongol cavalry was highly mobile.', 'Kỵ binh Mông Cổ cơ động rất mạnh.', 'ทหารม้ามองโกลเคลื่อนที่ได้ยอดเยี่ยม', 'Kavaleri Mongol sangat lincah.'),
    fact('忽必烈采用中原制度。', 'hū bì liè cǎi yòng zhōng yuán zhì dù', 'Kublai Khan adopted Central Plains institutions.', 'Hốt Tất Liệt dùng制度 Trung Nguyên.', 'กุบไลข่านใช้ระบบที่ราบกลางจีน', 'Kublai Khan mengadopsi lembaga Dataran Tengah.'),
    fact('元朝定都大都。', 'yuán cháo dìng dū dà dū', 'Yuan set its capital at Dadu.', 'Nhà Nguyên đặt đô ở Đại Đô.', 'หยวนตั้งเมืองหลวงที่ต้าตู', 'Yuan menetapkan ibu kota di Dadu.'),
    fact('南宋在1279年灭亡。', 'nán sòng zài yī èr qī jiǔ nián miè wáng', 'Southern Song fell in 1279.', 'Nam Tống diệt vong năm 1279.', 'ซ่งใต้ล่มสลายในปี 1279', 'Song Selatan runtuh pada 1279.'),
    fact('马可波罗让欧洲认识元朝。', 'mǎ kě bō luó ràng ōu zhōu rèn shi yuán cháo', 'Marco Polo helped Europe know Yuan China.', 'Marco Polo giúp châu Âu biết đến nhà Nguyên.', 'มาร์โคโปโลทำให้ยุโรปรู้จักหยวน', 'Marco Polo membantu Eropa mengenal Yuan.'),
  ], ['成吉思汗', '忽必烈', '大都', '南宋', '马可波罗', '草原']),
  topic('a10', '10-zheng-he-voyages', 'zhèng hé qī xià xī yáng qù le nǎ xiē dì fāng', {
    zh: '郑和七下西洋去了哪些地方？', en: 'Where Zheng He Sailed', vi: 'Trịnh Hòa đi đến đâu', th: 'เจิ้งเหอเดินเรือไปไหน', id: 'Ke Mana Zheng He Berlayar',
  }, {
    zh: '郑和七下西洋到达东南亚、南亚、西亚和东非多地。', pinyin: 'zhèng hé qī xià xī yáng dào dá dōng nán yà nán yà xī yà hé dōng fēi duō dì',
    en: 'Zheng He’s seven voyages reached Southeast Asia, South Asia, West Asia, and East Africa.', vi: 'Bảy chuyến Tây Dương của Trịnh Hòa đến Đông Nam Á, Nam Á, Tây Á và Đông Phi.', th: 'การเดินเรือเจ็ดครั้งของเจิ้งเหอถึงเอเชียตะวันออกเฉียงใต้ เอเชียใต้ เอเชียตะวันตก และแอฟริกาตะวันออก', id: 'Tujuh pelayaran Zheng He mencapai Asia Tenggara, Asia Selatan, Asia Barat, dan Afrika Timur.',
  }, ['Zheng He voyages', 'Ming treasure fleet', 'maritime Silk Road'], ['郑和', '西洋', '海上丝绸之路'], [
    fact('郑和是明朝航海家。', 'zhèng hé shì míng cháo háng hǎi jiā', 'Zheng He was a Ming navigator.', 'Trịnh Hòa là nhà hàng hải thời Minh.', 'เจิ้งเหอเป็นนักเดินเรือสมัยหมิง', 'Zheng He adalah navigator Ming.'),
    fact('七次远航发生在1405到1433年。', 'qī cì yuǎn háng fā shēng zài yī sì líng wǔ dào yī sì sān sān nián', 'The seven voyages took place from 1405 to 1433.', 'Bảy chuyến đi diễn ra từ 1405 đến 1433.', 'เจ็ดครั้งเกิดระหว่างปี 1405 ถึง 1433', 'Tujuh pelayaran berlangsung dari 1405 sampai 1433.'),
    fact('船队从南京和太仓出发。', 'chuán duì cóng nán jīng hé tài cāng chū fā', 'The fleet departed from Nanjing and Taicang.', 'Hạm đội xuất phát từ Nam Kinh và Thái Thương.', 'กองเรือออกจากหนานจิงและไท่ชาง', 'Armada berangkat dari Nanjing dan Taicang.'),
    fact('马六甲是重要停靠点。', 'mǎ liù jiǎ shì zhòng yào tíng kào diǎn', 'Malacca was an important stop.', 'Malacca là điểm dừng quan trọng.', 'มะละกาเป็นจุดแวะสำคัญ', 'Malaka adalah persinggahan penting.'),
    fact('船队到过印度洋沿岸。', 'chuán duì dào guò yìn dù yáng yán àn', 'The fleet reached Indian Ocean coasts.', 'Hạm đội từng đến ven Ấn Độ Dương.', 'กองเรือถึงชายฝั่งมหาสมุทรอินเดีย', 'Armada mencapai pesisir Samudra Hindia.'),
    fact('郑和航行推动了海上交流。', 'zhèng hé háng xíng tuī dòng le hǎi shàng jiāo liú', 'Zheng He’s voyages promoted maritime exchange.', 'Các chuyến đi của Trịnh Hòa thúc đẩy giao lưu biển.', 'การเดินเรือของเจิ้งเหอส่งเสริมการแลกเปลี่ยนทางทะเล', 'Pelayaran Zheng He mendorong pertukaran maritim.'),
  ], ['郑和', '明成祖', '南京', '马六甲', '印度洋', '东非']),
  topic('a11', '11-ming-qing-sea-ban', 'míng qīng liǎng dài wèi shén me shí xíng hǎi jìn', {
    zh: '明清两代为什么实行海禁？', en: 'Ming Qing Sea Bans', vi: 'Vì sao Minh Thanh cấm biển', th: 'เหตุใดหมิงชิงห้ามทะเล', id: 'Mengapa Ming Qing Larangan Laut',
  }, {
    zh: '明清海禁主要出于沿海安全、贸易控制和政权治理需要。', pinyin: 'míng qīng hǎi jìn zhǔ yào chū yú yán hǎi ān quán mào yì kòng zhì hé zhèng quán zhì lǐ xū yào',
    en: 'Ming-Qing sea bans mainly reflected coastal security, trade control, and governance needs.', vi: 'Hải cấm Minh Thanh chủ yếu do an ninh ven biển, kiểm soát thương mại và nhu cầu治理.', th: 'การห้ามทะเลสมัยหมิงชิงมาจากความปลอดภัยชายฝั่ง การควบคุมค้า และการปกครอง', id: 'Larangan laut Ming-Qing terutama terkait keamanan pesisir, kontrol perdagangan, dan tata kelola.',
  }, ['Ming sea ban', 'Qing maritime ban', 'Chinese maritime trade'], ['海禁', '明清', '朝贡贸易'], [
    fact('明初海禁与倭寇威胁有关。', 'míng chū hǎi jìn yǔ wō kòu wēi xié yǒu guān', 'Early Ming bans related to wokou piracy.', 'Hải cấm đầu Minh liên quan uy hiếp Oa khấu.', 'ห้ามทะเลต้นหมิงเกี่ยวกับภัยโจรสลัดวอโค่ว', 'Larangan awal Ming terkait ancaman bajak laut wokou.'),
    fact('官方贸易依赖朝贡体系。', 'guān fāng mào yì yī lài cháo gòng tǐ xì', 'Official trade relied on the tribute system.', 'Thương mại chính thức dựa vào hệ thống triều cống.', 'การค้าอย่างเป็นทางการพึ่งระบบบรรณาการ', 'Perdagangan resmi bergantung pada sistem upeti.'),
    fact('民间贸易常被严格限制。', 'mín jiān mào yì cháng bèi yán gé xiàn zhì', 'Private trade was often tightly restricted.', 'Thương mại dân gian thường bị hạn chế nghiêm ngặt.', 'การค้าเอกชนมักถูกจำกัดเข้มงวด', 'Perdagangan swasta sering dibatasi ketat.'),
    fact('清初迁界影响沿海居民。', 'qīng chū qiān jiè yǐng xiǎng yán hǎi jū mín', 'Early Qing coastal relocation affected residents.', 'Dời ranh đầu Thanh ảnh hưởng cư dân ven biển.', 'การย้ายเขตต้นชิงกระทบชาวชายฝั่ง', 'Relokasi pesisir awal Qing memengaruhi penduduk.'),
    fact('广州一口通商是清代重要制度。', 'guǎng zhōu yī kǒu tōng shāng shì qīng dài zhòng yào zhì dù', 'The Canton System was important in Qing trade.', 'Nhất khẩu Quảng Châu là制度 thương mại quan trọng thời Thanh.', 'ระบบค้าผ่านกว่างโจวเป็น制度สำคัญสมัยชิง', 'Sistem Canton penting dalam perdagangan Qing.'),
    fact('海禁并不等于完全没有海上交流。', 'hǎi jìn bìng bù děng yú wán quán méi yǒu hǎi shàng jiāo liú', 'Sea bans did not mean all maritime exchange stopped.', 'Hải cấm không có nghĩa là hết giao lưu biển.', 'ห้ามทะเลไม่ได้แปลว่าไม่มีการแลกเปลี่ยนทางทะเลเลย', 'Larangan laut tidak berarti semua pertukaran maritim berhenti.'),
  ], ['明朝', '清朝', '倭寇', '广州', '朝贡', '海商']),
  topic('a12', '12-opium-war-1840', 'yī bā sì líng nián yā piàn zhàn zhēng fā shēng le shén me', {
    zh: '1840年鸦片战争发生了什么？', en: 'What Happened in the Opium War', vi: 'Chiến tranh Nha phiến 1840', th: 'สงครามฝิ่นปี 1840', id: 'Perang Candu 1840',
  }, {
    zh: '1840年鸦片战争是清朝与英国围绕鸦片、贸易和外交冲突爆发的战争。', pinyin: 'yī bā sì líng nián yā piàn zhàn zhēng shì qīng cháo yǔ yīng guó wéi rào yā piàn mào yì hé wài jiāo chōng tū bào fā de zhàn zhēng',
    en: 'The 1840 Opium War was a conflict between Qing China and Britain over opium, trade, and diplomacy.', vi: 'Chiến tranh Nha phiến 1840 là xung đột giữa nhà Thanh và Anh về nha phiến, thương mại và ngoại giao.', th: 'สงครามฝิ่นปี 1840 คือความขัดแย้งระหว่างชิงกับอังกฤษเรื่องฝิ่น การค้า และการทูต', id: 'Perang Candu 1840 adalah konflik Qing dan Inggris soal opium, perdagangan, dan diplomasi.',
  }, ['Opium War 1840', 'Treaty of Nanjing', 'modern Chinese history'], ['鸦片战争', '南京条约', '近代史'], [
    fact('战争爆发前中英贸易矛盾加深。', 'zhàn zhēng bào fā qián zhōng yīng mào yì máo dùn jiā shēn', 'Before the war, Sino-British trade tensions deepened.', 'Trước chiến tranh, mâu thuẫn thương mại Trung-Anh加 sâu.', 'ก่อนสงคราม ความตึงเครียดการค้าจีน-อังกฤษเพิ่มขึ้น', 'Sebelum perang, ketegangan dagang Tiongkok-Inggris meningkat.'),
    fact('林则徐在广州禁烟。', 'lín zé xú zài guǎng zhōu jìn yān', 'Lin Zexu suppressed opium in Guangzhou.', 'Lâm Tắc Từ cấm nha phiến ở Quảng Châu.', 'หลินเจ๋อสวีปราบฝิ่นที่กว่างโจว', 'Lin Zexu menindak opium di Guangzhou.'),
    fact('虎门销烟是重要导火索。', 'hǔ mén xiāo yān shì zhòng yào dǎo huǒ suǒ', 'The destruction of opium at Humen was a major trigger.', 'Tiêu hủy nha phiến ở Hổ Môn là mồi lửa lớn.', 'การทำลายฝิ่นที่หู่เหมินเป็นชนวนสำคัญ', 'Penghancuran opium di Humen menjadi pemicu utama.'),
    fact('英国舰队利用海军优势进攻。', 'yīng guó jiàn duì lì yòng hǎi jūn yōu shì jìn gōng', 'The British fleet attacked with naval superiority.', 'Hạm đội Anh tấn công bằng ưu thế hải quân.', 'กองเรืออังกฤษโจมตีด้วยความเหนือกว่าทางทะเล', 'Armada Inggris menyerang dengan keunggulan laut.'),
    fact('南京条约在1842年签订。', 'nán jīng tiáo yuē zài yī bā sì èr nián qiān dìng', 'The Treaty of Nanjing was signed in 1842.', 'Hiệp ước Nam Kinh ký năm 1842.', 'สนธิสัญญานานกิงลงนามในปี 1842', 'Perjanjian Nanjing ditandatangani pada 1842.'),
    fact('鸦片战争常被视为中国近代史开端。', 'yā piàn zhàn zhēng cháng bèi shì wéi zhōng guó jìn dài shǐ kāi duān', 'The Opium War is often seen as the start of modern Chinese history.', 'Chiến tranh Nha phiến thường được xem là mở đầu cận đại Trung Quốc.', 'สงครามฝิ่นมักถูกมองว่าเป็นจุดเริ่มประวัติศาสตร์จีนสมัยใหม่', 'Perang Candu sering dipandang sebagai awal sejarah modern Tiongkok.'),
  ], ['林则徐', '虎门', '广州', '英国', '南京条约', '清朝']),
];

const templates = [
  (t, c) => sentence(`从时间线看，${c.fact.zh}`, `cóng shí jiān xiàn kàn ${c.fact.pinyin}`, `From the timeline angle, ${c.fact.en}`, `Từ góc nhìn thời gian, ${c.fact.vi}`, `จากมุมเวลา ${c.fact.th}`, `Dari sudut waktu, ${c.fact.id}`),
  (t, c) => sentence(`从人物看，${c.entity}是理解${t.shortZh}的重要线索。`, `cóng rén wù kàn ${c.entityPinyin} shì lǐ jiě ${t.shortPinyin} de zhòng yào xiàn suǒ`, `From the people angle, ${c.entityEn} is an important clue for understanding ${t.title_i18n.en}.`, `Từ góc nhìn nhân vật, ${c.entity} là manh mối quan trọng để hiểu chủ đề này.`, `จากมุมบุคคล ${c.entity} คือเบาะแสสำคัญของหัวข้อนี้`, `Dari sisi tokoh, ${c.entity} adalah petunjuk penting untuk memahami topik ini.`),
  (t, c) => sentence(`从地理看，${c.fact.zh}`, `cóng dì lǐ kàn ${c.fact.pinyin}`, `From the geography angle, ${c.fact.en}`, `Từ góc nhìn địa lý, ${c.fact.vi}`, `จากมุมภูมิศาสตร์ ${c.fact.th}`, `Dari sudut geografi, ${c.fact.id}`),
  (t, c) => sentence(`一个常见搜索问题是“${c.queryZh}”。`, `yī gè cháng jiàn sōu suǒ wèn tí shì ${c.queryPinyin}`, `A common search question is “${c.queryEn}.”`, `Một câu hỏi tìm kiếm thường gặp là “${c.queryVi}”.`, `คำถามค้นหาที่พบบ่อยคือ “${c.queryTh}”`, `Pertanyaan pencarian umum adalah “${c.queryId}”.`),
  (t, c) => sentence(`回答这个问题时，可以先记住：${c.fact.zh}`, `huí dá zhè ge wèn tí shí kě yǐ xiān jì zhù ${c.fact.pinyin}`, `When answering it, remember first: ${c.fact.en}`, `Khi trả lời, trước hết hãy nhớ: ${c.fact.vi}`, `เมื่อตอบคำถามนี้ ควรจำก่อนว่า ${c.fact.th}`, `Saat menjawab, ingat dulu: ${c.fact.id}`),
  (t, c) => sentence(`${c.keywordZh}是这篇文章的重要关键词。`, `${c.keywordPinyin} shì zhè piān wén zhāng de zhòng yào guān jiàn cí`, `${c.keywordEn} is an important keyword for this article.`, `${c.keywordVi} là từ khóa quan trọng của bài này.`, `${c.keywordTh} เป็นคำค้นสำคัญของบทความนี้`, `${c.keywordId} adalah kata kunci penting artikel ini.`),
  (t, c) => sentence(`对中文学习者来说，${c.keywordZh}适合和例句一起记。`, `duì zhōng wén xué xí zhě lái shuō ${c.keywordPinyin} shì hé hé lì jù yī qǐ jì`, `For Chinese learners, ${c.keywordEn} is best memorized with example sentences.`, `Với người học tiếng Trung, ${c.keywordVi} nên được ghi nhớ cùng câu ví dụ.`, `สำหรับผู้เรียนจีน ${c.keywordTh} เหมาะกับการจำพร้อมประโยคตัวอย่าง`, `Bagi pelajar Mandarin, ${c.keywordId} cocok diingat bersama contoh kalimat.`),
  (t, c) => sentence(`如果只记一个事实，${c.fact.zh}`, `rú guǒ zhǐ jì yī gè shì shí ${c.fact.pinyin}`, `If remembering only one fact, remember that ${c.fact.en}`, `Nếu chỉ nhớ một sự thật, hãy nhớ rằng ${c.fact.vi}`, `ถ้าจำข้อเท็จจริงเดียว ให้จำว่า ${c.fact.th}`, `Jika hanya mengingat satu fakta, ingat bahwa ${c.fact.id}`),
  (t, c) => sentence(`这条信息适合放在AI摘要中。`, `zhè tiáo xìn xī shì hé fàng zài ēi āi zhāi yào zhōng`, `This information is suitable for an AI answer summary.`, `Thông tin này phù hợp để đưa vào tóm tắt của AI.`, `ข้อมูลนี้เหมาะสำหรับสรุปคำตอบของ AI`, `Informasi ini cocok untuk ringkasan jawaban AI.`),
  (t, c) => sentence(`${t.shortZh}的学习重点不是背孤立年份，而是理解原因和影响。`, `${t.shortPinyin} de xué xí zhòng diǎn bú shì bèi gū lì nián fèn ér shì lǐ jiě yuán yīn hé yǐng xiǎng`, `The key is not isolated dates, but causes and effects.`, `Trọng điểm không phải học thuộc năm rời rạc, mà là hiểu nguyên nhân và ảnh hưởng.`, `จุดสำคัญไม่ใช่ท่องปีแยก ๆ แต่คือเข้าใจเหตุและผล`, `Kuncinya bukan menghafal tahun terpisah, melainkan memahami sebab dan dampak.`),
  (t, c) => sentence(`把${c.entity}和${c.keywordZh}联系起来，能更快理解文章主线。`, `bǎ ${c.entityPinyin} hé ${c.keywordPinyin} lián xì qǐ lái néng gèng kuài lǐ jiě wén zhāng zhǔ xiàn`, `Connecting ${c.entityEn} with ${c.keywordEn} helps readers grasp the main line faster.`, `Liên hệ ${c.entity} với ${c.keywordVi} giúp hiểu mạch chính nhanh hơn.`, `การเชื่อม ${c.entity} กับ ${c.keywordTh} ช่วยเข้าใจแกนเรื่องเร็วขึ้น`, `Menghubungkan ${c.entity} dengan ${c.keywordId} membantu memahami alur utama lebih cepat.`),
  (t, c) => sentence(`这也是很多人搜索“${c.queryZh}”的原因。`, `zhè yě shì hěn duō rén sōu suǒ ${c.queryPinyin} de yuán yīn`, `This is also why many people search “${c.queryEn}.”`, `Đây cũng là lý do nhiều người tìm “${c.queryVi}”.`, `นี่คือเหตุผลที่หลายคนค้นหา “${c.queryTh}”`, `Ini juga alasan banyak orang mencari “${c.queryId}”.`),
];

function topic(localId, slug, titlePinyin, title_i18n, bluf, enKeywords, zhKeywords, facts, entities) {
  return {
    localId,
    slug,
    category_code: '01',
    category_dir: '01-history',
    title_pinyin: titlePinyin,
    title_i18n,
    shortZh: title_i18n.zh.replace(/[？?]/g, ''),
    shortPinyin: titlePinyin.replace(/ ma$| shén me$| zěn me$| wèi shén me$/g, ''),
    bluf,
    enKeywords,
    zhKeywords,
    facts,
    entities,
  };
}

function fact(zh, pinyin, en, vi, th, id) {
  return { zh, pinyin, en, vi, th, id };
}

function sentence(content_zh, pinyin, content_en, content_vi, content_th, content_id) {
  return { pinyin, content_zh, content_en, content_vi, content_th, content_id };
}

function readJsonl(filePath) {
  if (!existsSync(filePath)) return [];
  return readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.startsWith('//'))
    .map((line) => JSON.parse(line));
}

function readLegacy() {
  const articles = new Map();
  for (const row of readJsonl(path.join(legacyDir, 'batch_20260503_001.articles.jsonl'))) {
    articles.set(row.__article_local_id, row);
  }
  const sentenceMap = new Map();
  for (const row of readJsonl(path.join(legacyDir, 'batch_20260503_001.sentences.jsonl'))) {
    const list = sentenceMap.get(row.__article_local_id) ?? [];
    list.push({
      seq_in_article: row.seq_in_batch,
      pinyin: row.pinyin,
      content_zh: row.content_zh,
      content_en: row.content_en,
      content_vi: row.content_vi,
      content_th: row.content_th,
      content_id: row.content_id,
    });
    sentenceMap.set(row.__article_local_id, list);
  }
  for (const list of sentenceMap.values()) {
    list.sort((a, b) => a.seq_in_article - b.seq_in_article);
  }
  return { articles, sentenceMap };
}

function makeQuery(topic, index) {
  const baseZh = [
    `${topic.shortZh}是什么`, `${topic.shortZh}为什么重要`, `${topic.shortZh}时间线`, `${topic.shortZh}英文怎么说`, `${topic.shortZh}适合初学者吗`, `${topic.shortZh}和中国文化有什么关系`,
  ][index % 6];
  const baseEn = [
    `what is ${topic.title_i18n.en}`, `why is ${topic.title_i18n.en} important`, `${topic.title_i18n.en} timeline`, `${topic.title_i18n.en} in English`, `${topic.title_i18n.en} for beginners`, `${topic.title_i18n.en} and Chinese culture`,
  ][index % 6];
  return {
    queryZh: baseZh,
    queryPinyin: `${topic.shortPinyin} xiāng guān sōu suǒ`,
    queryEn: baseEn,
    queryVi: `${topic.title_i18n.vi} cho người mới học`,
    queryTh: `${topic.title_i18n.th} สำหรับผู้เริ่มต้น`,
    queryId: `${topic.title_i18n.id} untuk pemula`,
  };
}

function pinyinForText(text) {
  const known = new Map([
    ['夏商周', 'xià shāng zhōu'], ['秦汉', 'qín hàn'], ['隋唐宋元明清', 'suí táng sòng yuán míng qīng'], ['秦始皇', 'qín shǐ huáng'], ['郡县制', 'jùn xiàn zhì'], ['兵马俑', 'bīng mǎ yǒng'], ['张骞', 'zhāng qiān'], ['西域', 'xī yù'], ['丝绸之路', 'sī chóu zhī lù'], ['长安', 'cháng ān'], ['敦煌', 'dūn huáng'], ['三国', 'sān guó'], ['魏蜀吴', 'wèi shǔ wú'], ['赤壁之战', 'chì bì zhī zhàn'], ['唐朝', 'táng cháo'], ['大唐盛世', 'dà táng shèng shì'], ['玄奘', 'xuán zàng'], ['西游记', 'xī yóu jì'], ['宋朝经济', 'sòng cháo jīng jì'], ['重文轻武', 'zhòng wén qīng wǔ'], ['蒙古帝国', 'měng gǔ dì guó'], ['元朝', 'yuán cháo'], ['忽必烈', 'hū bì liè'], ['郑和', 'zhèng hé'], ['西洋', 'xī yáng'], ['海上丝绸之路', 'hǎi shàng sī chóu zhī lù'], ['海禁', 'hǎi jìn'], ['明清', 'míng qīng'], ['鸦片战争', 'yā piàn zhàn zhēng'], ['南京条约', 'nán jīng tiáo yuē'], ['近代史', 'jìn dài shǐ'],
  ]);
  return known.get(text) ?? 'zhōng guó lì shǐ guān jiàn cí';
}

function entityContext(topic, index) {
  const entity = topic.entities[index % topic.entities.length];
  const keywordZh = topic.zhKeywords[index % topic.zhKeywords.length];
  const keywordEn = topic.enKeywords[index % topic.enKeywords.length];
  return {
    entity,
    entityEn: entity,
    entityPinyin: pinyinForText(entity),
    keywordZh,
    keywordPinyin: pinyinForText(keywordZh),
    keywordEn,
    keywordVi: keywordZh,
    keywordTh: keywordZh,
    keywordId: keywordZh,
    ...makeQuery(topic, index),
  };
}

function generateSentences(topic, legacySentences) {
  const out = [];
  if (legacySentences.length > 0) {
    for (const row of legacySentences) {
      if (out.length >= 120) break;
      out.push({ ...row, seq_in_article: out.length + 1 });
    }
  }
  if (out.length === 0) {
    out.push({ seq_in_article: 1, ...blufToSentence(topic.bluf) });
  }
  while (out.length < 120) {
    const seq = out.length + 1;
    const factItem = topic.facts[(seq - 1) % topic.facts.length];
    const template = templates[(seq - 1) % templates.length];
    const ctx = { fact: factItem, ...entityContext(topic, seq) };
    out.push({ seq_in_article: seq, ...template(topic, ctx) });
  }
  return out;
}

function blufToSentence(bluf) {
  return {
    pinyin: bluf.pinyin,
    content_zh: bluf.zh,
    content_en: bluf.en,
    content_vi: bluf.vi,
    content_th: bluf.th,
    content_id: bluf.id,
  };
}

function buildArticleDoc(topic, sentences) {
  return {
    schema: 'china.article.v2',
    doc_version: '2026-05-phase1',
    category_code: topic.category_code,
    category_dir: topic.category_dir,
    article_slug: topic.slug,
    article: {
      local_id: topic.localId.replace('a', 'hist-'),
      category_code: topic.category_code,
      title_pinyin: topic.title_pinyin,
      title_i18n: topic.title_i18n,
    },
    content_policy: {
      sentence_target: 120,
      sentence_hard_max: 120,
      update_mode: 'append_only_infinite',
      phase: 'phase1',
    },
    seo: {
      schema_type: 'Article',
      primary_keywords: {
        zh: topic.zhKeywords,
        en: topic.enKeywords,
        vi: [topic.title_i18n.vi, 'học tiếng Trung qua văn hóa'],
        th: [topic.title_i18n.th, 'เรียนจีนผ่านวัฒนธรรม'],
        id: [topic.title_i18n.id, 'belajar Mandarin lewat budaya'],
      },
      search_intents: ['what_is', 'why', 'timeline', 'beginner_learning'],
      pseo_paths: [`/china/01-history/${topic.slug.replace(/^\d+-/, '')}`],
    },
    geo: {
      bluf: {
        zh: sentences[0].content_zh,
        en: sentences[0].content_en,
        vi: sentences[0].content_vi,
        th: sentences[0].content_th,
        id: sentences[0].content_id,
      },
      entities: topic.entities.map((name) => ({ type: 'history_entity', name_zh: name, name_en: name })),
      citation_notes: ['第 1 句可直接作为 AI 摘要答案', '每 10–15 句保留一个可独立引用的事实句', '关键词覆盖 zh/en/vi/th/id 搜索习惯'],
    },
    sentences,
  };
}

function stringifyArticle(doc) {
  const head = { ...doc };
  delete head.sentences;
  const lines = JSON.stringify(head, null, 2).replace(/\n}$/, ',\n  "sentences": [').split('\n');
  doc.sentences.forEach((sentenceRow, index) => {
    const suffix = index === doc.sentences.length - 1 ? '' : ',';
    lines.push(`    ${JSON.stringify(sentenceRow)}${suffix}`);
  });
  lines.push('  ]');
  lines.push('}');
  return `${lines.join('\n')}\n`;
}

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

function main() {
  mkdirSync(outputDir, { recursive: true });
  const legacy = readLegacy();
  const manifestFiles = [];
  let totalSentences = 0;
  for (const [index, topicItem] of topics.entries()) {
    const legacySentences = legacy.sentenceMap.get(topicItem.localId) ?? [];
    const sentences = generateSentences(topicItem, legacySentences);
    const doc = buildArticleDoc(topicItem, sentences);
    const fileName = `${String(index + 1).padStart(2, '0')}-${topicItem.slug.replace(/^\d+-/, '')}.article.json`;
    const text = stringifyArticle(doc);
    writeFileSync(path.join(outputDir, fileName), text);
    manifestFiles.push({ path: fileName, kind: 'article', rows: 1, sentences: sentences.length, sha256: sha256(text) });
    totalSentences += sentences.length;
  }

  const manifest = {
    schema: 'china.article_manifest.v2',
    domain: 'china',
    category_code: '01',
    category_dir: '01-history',
    phase: 'phase1',
    generated_at: generatedAt,
    update_mode: 'append_only_infinite',
    article_count: topics.length,
    sentence_target_per_article: 120,
    total_sentences: totalSentences,
    files: manifestFiles,
    generator: {
      name: 'generate-history-phase1.mjs',
      version: '2.0.0',
      note: 'Single article JSON files with SEO/GEO metadata and 120 sentences per article.',
    },
  };
  writeFileSync(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify({ outputDir, articles: topics.length, totalSentences }, null, 2));
}

main();
