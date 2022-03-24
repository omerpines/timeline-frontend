'use strict';

/**
 *  character-relation controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const contr = createCoreController('api::character-relation.character-relation');
console.log(contr);

module.exports = contr;