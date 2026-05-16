import { BitUpgradeState, GameMechanicState } from "./game-mechanics";
import { GameDatabase } from "./secret-formula/game-database";


/**
 * Information about how to format runUnlocks:
 * id: unique id
 * name: the achievement name
 * description: Description what you need to do, for values add {value}
 * values: different values to display and check against the game
 * condition: function that takes the current value as an argument, if true completes an achievement
 * format: optional function that formats the value, defaults to format()
 */

class CelestialMilestoneState extends GameMechanicState {

}

/**
 * @param {number} id
 * @return {VRunUnlockState}
 */
export const CelestialMilestone = CelestialMilestoneState.createAccessor(GameDatabase.rewind.celestialMilestones);

export const CelestialMilestones = {
  /**
   * @type {CelestialMilestoneState[]}
   */
  all: CelestialMilestone.index.compact(),
};