/**
 * Pure deterministic energy & carbon calculation functions.
 * All formulas execute in application logic without any LLM estimations.
 */

export interface LightingSimulationInput {
  currentWatts: number;
  proposedWatts: number;
  quantity: number;
  hoursPerDay: number;
  numberOfDays: number;
  tariffRate?: number; // Currency per kWh (e.g., 0.165 for $0.165/kWh)
  emissionFactor?: number; // kg CO2e per kWh (e.g., 0.386)
}

export interface SimulationOutput {
  kwhSaved: number;
  moneySaved: number;
  co2SavedKg: number;
  percentReduction: number;
}

/**
 * Formula: ((current_watts - proposed_watts) * quantity * hours_per_day * number_of_days) / 1000
 */
export function calculateLightingSavings(
  input: LightingSimulationInput
): SimulationOutput {
  const {
    currentWatts,
    proposedWatts,
    quantity,
    hoursPerDay,
    numberOfDays,
    tariffRate = 0.165,
    emissionFactor = 0.386,
  } = input;

  const wattDifference = Math.max(0, currentWatts - proposedWatts);
  const baselineTotalWatts = currentWatts * quantity;

  // Potential kWh savings
  const kwhSaved = Number(
    (
      (wattDifference * quantity * hoursPerDay * numberOfDays) /
      1000
    ).toFixed(2)
  );

  // Potential financial savings
  const moneySaved = Number((kwhSaved * tariffRate).toFixed(2));

  // Potential emissions avoided
  const co2SavedKg = Number((kwhSaved * emissionFactor).toFixed(2));

  // Percentage reduction
  const baselineKwh =
    (baselineTotalWatts * hoursPerDay * numberOfDays) / 1000;
  const percentReduction =
    baselineKwh > 0 ? Math.round((kwhSaved / baselineKwh) * 100) : 0;

  return {
    kwhSaved,
    moneySaved,
    co2SavedKg,
    percentReduction,
  };
}

export interface ApplianceSimulationInput {
  applianceWatts: number;
  hoursReducedPerDay: number;
  numberOfDays: number;
  tariffRate?: number;
  emissionFactor?: number;
}

/**
 * Formula: (appliance_watts * hours_reduced_per_day * number_of_days) / 1000
 */
export function calculateApplianceSavings(
  input: ApplianceSimulationInput
): SimulationOutput {
  const {
    applianceWatts,
    hoursReducedPerDay,
    numberOfDays,
    tariffRate = 0.165,
    emissionFactor = 0.386,
  } = input;

  const kwhSaved = Number(
    ((applianceWatts * hoursReducedPerDay * numberOfDays) / 1000).toFixed(2)
  );
  const moneySaved = Number((kwhSaved * tariffRate).toFixed(2));
  const co2SavedKg = Number((kwhSaved * emissionFactor).toFixed(2));

  return {
    kwhSaved,
    moneySaved,
    co2SavedKg,
    percentReduction: 100,
  };
}
