import { VaultPost } from '../types';

export const VAULT_POSTS_DATA: VaultPost[] = [
  {
    id: '101',
    img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
    caption: '2.40ct Oval Brilliant Solitaire, handcrafted in Birmingham on a whisper-thin platinum micro-pave band. D colour, FL.',
    category: 'Engagement Ring',
    carat: '2.40ct',
    cut: 'Oval',
    metal: 'Platinum',
    likes: 1842,
    comments: 56
  },
  {
    id: '102',
    img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=85',
    caption: '3.10ct Emerald-Cut diamond, certified by IGI. Mounted on claw-set double-talon prongs.',
    category: 'Loose Diamond',
    carat: '3.10ct',
    cut: 'Emerald',
    metal: 'Platinum',
    likes: 1204,
    comments: 32
  },
  {
    id: '103',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85',
    caption: 'Radiant Cut Trilogy commission. 2.80ct centre diamond with matched cadillac step-cut side gems in 18k yellow gold.',
    category: 'Engagement Ring',
    carat: '2.80ct',
    cut: 'Radiant',
    metal: '18k Yellow Gold',
    likes: 2410,
    comments: 89
  },
  {
    id: '104',
    img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85',
    caption: 'Work in progress: setting the secondary micro-gems under the collar of a hidden halo ring.',
    category: 'Workshop / Crafting',
    carat: '1.80ct',
    cut: 'Round',
    metal: '18k Rose Gold',
    likes: 938,
    comments: 19
  },
  {
    id: '105',
    img: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=800&q=85',
    caption: 'A flawless 1.80ct Round Brilliant, VVS1, ideal proportions on an elegant cathedral shank platinum frame.',
    category: 'Engagement Ring',
    carat: '1.80ct',
    cut: 'Round',
    metal: 'Platinum',
    likes: 1530,
    comments: 44
  },
  {
    id: '106',
    img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=85',
    caption: '2.05ct Pear Brilliant floating on a solid 18k yellow gold band. Refined and classic.',
    category: 'Engagement Ring',
    carat: '2.05ct',
    cut: 'Pear',
    metal: '18k Yellow Gold',
    likes: 1672,
    comments: 42
  },
  {
    id: '107',
    img: 'https://images.unsplash.com/photo-1588444839799-6686de781d9f?auto=format&fit=crop&w=800&q=85',
    caption: 'A selection of raw, super-ideal loose diamond cuts waiting for custom commissions. IGI-certified.',
    category: 'Loose Diamond',
    carat: '3.00ct+',
    cut: 'Cushion',
    metal: 'Platinum',
    likes: 1102,
    comments: 26
  },
  {
    id: '108',
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85',
    caption: 'Fine calibration checks by our senior setting master in the Birmingham Jewellery Quarter.',
    category: 'Workshop / Crafting',
    carat: '2.20ct',
    cut: 'Oval',
    metal: '18k White Gold',
    likes: 812,
    comments: 11
  },
  {
    id: '109',
    img: 'https://images.unsplash.com/photo-1615655404746-8f030dbb6d2a?auto=format&fit=crop&w=800&q=85',
    caption: '3.50ct Cushion Cut Solitaire on an integrated triple-row diamond band.',
    category: 'Engagement Ring',
    carat: '3.50ct',
    cut: 'Cushion',
    metal: 'Platinum',
    likes: 3120,
    comments: 112
  },
  {
    id: '110',
    img: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=85',
    caption: 'Symmetry in motion. The three-stone Trilogy Emerald setting on platinum band.',
    category: 'Fine Jewellery',
    carat: '2.50ct',
    cut: 'Emerald',
    metal: 'Platinum',
    likes: 1498,
    comments: 31
  },
  {
    id: '111',
    img: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=85',
    caption: '2.20ct Oval Cut on daylight inspection. No artificial lighting.',
    category: 'Loose Diamond',
    carat: '2.20ct',
    cut: 'Oval',
    metal: 'Platinum',
    likes: 2190,
    comments: 72
  },
  {
    id: '112',
    img: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=85',
    caption: 'Modern geometry: East-West Marquise Cut Solitaire in heavy 18k yellow gold.',
    category: 'Fine Jewellery',
    carat: '1.50ct',
    cut: 'Marquise',
    metal: '18k Yellow Gold',
    likes: 1345,
    comments: 29
  }
];

export const DIAMOND_SHAPES = ['Oval', 'Round', 'Emerald', 'Cushion', 'Radiant', 'Pear', 'Marquise', 'Other'];

export const CARAT_OPTIONS = [
  '1.0ct - 1.5ct',
  '1.5ct - 2.0ct',
  '2.0ct - 3.0ct',
  '3.0ct - 5.0ct',
  'Bespoke 5.0ct+ Masterpieces',
  'Open to adviser recommendations'
];
