// Model registry: instantiate every model and declare associations.
import sequelize from '../config/database.js';

import babyFactory from './baby.model.js';
import parentFactory from './parent.model.js';
import galleryFactory from './gallery.model.js';
import timelineFactory from './timeline.model.js';
import wishFactory from './wish.model.js';
import musicFactory from './music.model.js';
import giftFactory from './gift.model.js';
import visitorFactory from './visitor.model.js';

const Baby = babyFactory(sequelize);
const Parent = parentFactory(sequelize);
const Gallery = galleryFactory(sequelize);
const Timeline = timelineFactory(sequelize);
const Wish = wishFactory(sequelize);
const Music = musicFactory(sequelize);
const Gift = giftFactory(sequelize);
const Visitor = visitorFactory(sequelize);

// --- Associations: Baby (1) -> (N) everything else ---------------------------
const children = [
  [Parent, 'parents'],
  [Gallery, 'photos'],
  [Timeline, 'timeline'],
  [Wish, 'wishes'],
  [Music, 'music'],
  [Gift, 'gifts'],
  [Visitor, 'visitors'],
];

for (const [Model, alias] of children) {
  Baby.hasMany(Model, { foreignKey: 'baby_id', as: alias, onDelete: 'CASCADE' });
  Model.belongsTo(Baby, { foreignKey: 'baby_id', as: 'baby' });
}

const db = { sequelize, Baby, Parent, Gallery, Timeline, Wish, Music, Gift, Visitor };

export { sequelize, Baby, Parent, Gallery, Timeline, Wish, Music, Gift, Visitor };
export default db;
