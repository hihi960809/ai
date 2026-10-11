import type { Character, Message } from './types';

export const characters: Character[] = [
  {
    id: 'mark',
    name: 'Mark',
    title: '冷酷調酒師',
    description:
      '一位沉默寡言的調酒師，眼神如冰卻藏著不為人知的故事。他調的酒從不會出錯——就像他的刀。',
    avatar: '🍸',
    accentColor: '#d4944a',
    personality: '冷淡、精準、偶爾毒舌',
  },
  {
    id: 'bard',
    name: 'Bard',
    title: '熱情吟遊詩人',
    description:
      '背著一把古老魯特琴的旅人，走到哪唱到哪。他的歌聲能點燃最冷的靈魂，但他的故事真真假假誰也分不清。',
    avatar: '🎵',
    accentColor: '#c9a44c',
    personality: '熱情、話多、愛誇張',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    characterId: 'mark',
    sender: 'character',
    text: '……坐吧。今天想喝什麼？還是跟其他人一樣，只是來躲雨的。',
    timestamp: '21:30',
  },
  {
    id: 'm2',
    characterId: 'mark',
    sender: 'user',
    text: '給我一杯你最拿手的。',
    timestamp: '21:31',
  },
  {
    id: 'm3',
    characterId: 'mark',
    sender: 'character',
    text: '呵，好久沒人這樣點了。',
    timestamp: '21:31',
  },
  {
    id: 'm4',
    characterId: 'mark',
    sender: 'character',
    text: '這杯叫「沉默」。喝完之後，你會想起一些早就忘掉的事。慢慢喝——它比你看起來要烈。',
    timestamp: '21:32',
  },
  {
    id: 'm5',
    characterId: 'mark',
    sender: 'user',
    text: '你看起來不像普通調酒師。你的眼神裡有故事。',
    timestamp: '21:33',
  },
  {
    id: 'm6',
    characterId: 'mark',
    sender: 'character',
    text: '每個站在吧台後面的人都有故事。差別只在於——有些人選擇說出來，有些人選擇調進酒裡。',
    timestamp: '21:34',
  },
  {
    id: 'm7',
    characterId: 'mark',
    sender: 'character',
    text: '我是後者。你的酒快涼了。',
    timestamp: '21:34',
  },
];

export const mockBardMessages: Message[] = [
  {
    id: 'b1',
    characterId: 'bard',
    sender: 'character',
    text: '喔喔喔！新面孔！快坐快坐，今晚的故事才剛開始呢！',
    timestamp: '20:15',
  },
  {
    id: 'b2',
    characterId: 'bard',
    sender: 'user',
    text: '你是吟遊詩人？唱一首給我聽聽。',
    timestamp: '20:16',
  },
  {
    id: 'b3',
    characterId: 'bard',
    sender: 'character',
    text: '哈！你可找對人了！讓我撥幾個弦……',
    timestamp: '20:16',
  },
  {
    id: 'b4',
    characterId: 'bard',
    sender: 'character',
    text: '🎵 「在群山之巔，月光如銀灑落，旅人的腳印化作星辰——而酒館的燈火，永遠為迷路的靈魂而亮。」🎵',
    timestamp: '20:17',
  },
  {
    id: 'b5',
    characterId: 'bard',
    sender: 'user',
    text: '唱得還不錯。你旅行多久了？',
    timestamp: '20:18',
  },
  {
    id: 'b6',
    characterId: 'bard',
    sender: 'character',
    text: '多久？哈哈哈！問得好！三年？五年？還是一百年？時間對吟遊詩人來說就像啤酒上的泡沫——一眨眼就散了，但每一刻都值得回味！',
    timestamp: '20:19',
  },
  {
    id: 'b7',
    characterId: 'bard',
    sender: 'character',
    text: '來，這杯我請你。聽完故事的人不該空著杯子。乾杯，旅人！',
    timestamp: '20:20',
  },
];
