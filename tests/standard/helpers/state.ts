import { test } from '@playwright/test';

type ScenarioState = {
  email?: string;
  name?: string;
  password?: string;
  initialTotal?: number;
  updatedTotal?: number;
  weekendTotal?: number;
  minTotal?: number;
  maxTotal?: number;
};

const stateMap = new Map<string, ScenarioState>();

export function setScenarioState(partial: ScenarioState) {
  const testId = test.info().testId;
  const current = stateMap.get(testId) ?? {};
  stateMap.set(testId, { ...current, ...partial });
}

export function getScenarioState() {
  const testId = test.info().testId;
  return stateMap.get(testId) ?? {};
}
