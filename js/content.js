const STORAGE_KEY = 'noel_site_content';

const DEFAULT_CONTENT = {
  hero: {
    subtitleTop: 'YOKOHAMA NAIL SALON',
    title: 'Noël',
    subtitle: '最高の推しネイルを、あなたの指先に'
  },
  concept: {
    visible: true,
    heading: 'あなたの「推し」を\n指先に込めて',
    paragraph1: 'nailsalon Noëlは、横浜・元町中華街エリアにある痛ネイル・キャラクターネイル専門のネイルサロンです。アニメ・ゲーム・アイドル――大好きな推しを細部までこだわったアートで指先にお届けします。',
    paragraph2: '爪への負担を最小限に抑えるパラジェル・フィルインにも対応。推しへの愛も、爪の健康も、どちらも大切にする施術を心がけています。',
    imageUrl: 'images/interior-treatment.jpg',
    features: [
      { icon: '🎨', title: '痛ネイル専門' },
      { icon: '💎', title: 'パラジェル対応' },
      { icon: '🦋', title: 'フィルイン対応' }
    ]
  },
  staff: {
    visible: true,
    members: [
      {
        name: 'なぎさ',
        role: '店長 / Nail Artist',
        desc: 'ネイリスト歴10年のオーナー店長。お客様の「推し」への想いを丁寧にヒアリングし、細部まで妥協しない痛ネイル・キャラクターネイルに仕上げます。パラジェル・フィルイン施術にも対応し、爪の健康も大切にした施術を心がけています。',
        photoUrl: '',
        designs: []
      },
      {
        name: 'くれか',
        role: 'Nail Artist',
        desc: 'ネイリスト歴6年。3Dネイルを得意とし、立体感あふれるアートで推しをより生き生きと表現します。繊細なパーツワークや複雑なデザインもお任せください。',
        photoUrl: '',
        designs: []
      },
      {
        name: 'ひな',
        role: 'Nail Artist',
        desc: 'ネイリスト歴1年。キャラクターネイルを得意とし、大好きな推しを一本一本丁寧に指先へ描き込みます。お客様の「好き」を全力でカタチにするべく、日々腕を磨いています。',
        photoUrl: '',
        designs: []
      },
      {
        name: 'はると',
        role: 'Nail Artist',
        desc: 'ネイリスト歴1年。まだまだ成長中ですが、一本一本丁寧にお客様の理想のネイルを目指します。笑顔でお迎えし、精一杯施術させていただきます。',
        photoUrl: '',
        designs: []
      }
    ]
  },
  menu: {
    visible: true,
    note: '※ 価格はすべて税込です。デザインの内容・本数により料金が異なります。\n※ 詳しい料金はホットペッパービューティーまたは公式LINEにてご確認ください。',
    categories: [
      {
        name: '痛ネイル・やり放題',
        items: [
          { name: '90分やり放題', desc: '4本アート程度 / 持ち込みデザインOK', price: '¥8,200' },
          { name: '120分やり放題', desc: '全体アート / イベント前におすすめ', price: '¥10,200' },
          { name: '150分やり放題', desc: 'イベント用 / とことんこだわりたい方に', price: '¥12,200' },
          { name: 'キャラクター1本＋モチーフ', desc: '手描きキャラクター1本＋イメージモチーフ', price: '¥15,000' },
          { name: 'キャラクター2本＋モチーフ', desc: '手描きキャラクター2本＋イメージモチーフ', price: '¥19,000' }
        ]
      },
      {
        name: 'デザイン定額',
        items: [
          { name: '定額デザイン', desc: '季節のおすすめデザインから選択', price: '¥7,980' }
        ]
      },
      {
        name: 'ケア・その他',
        items: [
          { name: 'ジェルオフのみ', desc: '他店オフも対応', price: 'お問い合わせください' },
          { name: 'リペア（1本）', desc: '欠け・浮きの補修', price: 'お問い合わせください' }
        ]
      }
    ]
  },
  gallery: {
    visible: true,
    images: [
      { url: '', label: '痛ネイル 01' },
      { url: '', label: '痛ネイル 02' },
      { url: '', label: '推しネイル 03' },
      { url: '', label: '推しネイル 04' },
      { url: '', label: 'キャラネイル 05' },
      { url: '', label: 'キャラネイル 06' },
      { url: '', label: 'デザイン 07' },
      { url: '', label: 'デザイン 08' }
    ]
  },
  interior: {
    visible: true,
    images: [
      { url: 'images/interior-treatment.jpg', label: '施術スペース' },
      { url: 'images/interior-reception.jpg', label: 'エントランス' },
      { url: 'images/interior-foot.jpg',      label: 'フットケアスペース' },
      { url: '', label: '待合スペース' },
      { url: '', label: 'サンプルディスプレイ' }
    ]
  },
  faq: {
    visible: true,
    items: [
      { q: '予約方法を教えてください', a: 'ご予約は公式LINEまたはホットペッパービューティーから承っております。InstagramのDMはメッセージが流れてしまうためご予約の受付ができません。ご了承ください。' },
      { q: '痛ネイルのデザインはどうやって決めますか？', a: '描いてほしいキャラクターやイメージの参考画像をお持ちください。カウンセリングでご希望を伺いながら、構図・配色などを一緒に決めていきます。「このキャラをこんな雰囲気で」といったざっくりしたご相談でもOKです。' },
      { q: 'パラジェル・フィルインとは何ですか？', a: 'パラジェルは爪の表面を削らずに密着するジェルで、自爪へのダメージを最小限に抑えられます。フィルインはジェルを全てオフせず、伸びた根元部分だけを付け替える技法です。繰り返しジェルネイルを楽しみたい方におすすめです。' },
      { q: '施術時間はどのくらいですか？', a: 'デザインにより異なりますが、ワンカラーで約1時間、痛ネイル・キャラクターアートは2〜3時間程度です。フルアート10本の場合はさらにお時間をいただくことがあります。初回はカウンセリングのお時間も含めて余裕を持ってお越しください。' },
      { q: 'ネイルが初めてでも大丈夫ですか？', a: 'もちろんです！爪の状態やライフスタイルに合わせて、最適なメニューとデザインをご提案いたします。初めての方もどうぞ安心してお越しください。' },
      { q: '駐車場はありますか？', a: '専用駐車場のご用意はございません。お車でお越しの際は近隣のコインパーキングをご利用ください。' },
      { q: 'キャンセル・変更はできますか？', a: 'ご予約の変更・キャンセルは、ご予約日の前日20時までに公式LINEよりご連絡ください。当日キャンセル・無断キャンセルはキャンセル料が発生する場合がございます。お席のご用意がございますので、早めのご連絡をお願いいたします。' },
      { q: 'Instagram DMで予約できますか？', a: '申し訳ございませんが、DMはメッセージが流れてしまうためご予約の受付ができません。ご予約は公式LINEまたはホットペッパービューティーよりお願いいたします。' }
    ]
  },
  access: {
    visible: true,
    salonName: 'nailsalon Noël',
    area: '横浜・元町中華街エリア',
    stations: 'みなとみらい線 元町・中華街駅 徒歩8分\nJR根岸線 石川町駅 徒歩4分',
    address: '神奈川県横浜市中区山手町27-5 ベイステージ元町508号室',
    hours: '11:00〜20:00',
    holidays: '不定休',
    features: 'パラジェル / フィルイン対応可能 / 完全予約制',
    mapEmbedUrl: ''
  },
  contact: {
    lineUrl: 'https://line.me/R/ti/p/@802orzur',
    hpbUrl: 'https://beauty.hotpepper.jp/kr/slnH000721618/',
    instagramUrl: 'https://www.instagram.com/nailsalon.noel',
    note: '※ InstagramのDMではご予約を受け付けておりません'
  }
};

function loadContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return deepMerge(DEFAULT_CONTENT, parsed);
    }
  } catch (e) {
    console.warn('Failed to load content:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
}

function saveContent(content) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    return true;
  } catch (e) {
    console.error('Failed to save content:', e);
    return false;
  }
}

function resetContent() {
  localStorage.removeItem(STORAGE_KEY);
}

function deepMerge(defaults, overrides) {
  const result = JSON.parse(JSON.stringify(defaults));
  for (const key of Object.keys(overrides)) {
    if (overrides[key] !== null && typeof overrides[key] === 'object' && !Array.isArray(overrides[key]) && result[key]) {
      result[key] = deepMerge(result[key], overrides[key]);
    } else {
      result[key] = overrides[key];
    }
  }
  return result;
}
