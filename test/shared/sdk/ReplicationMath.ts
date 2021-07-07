/// SDK Imports
import { inverse_std_n_cdf, std_n_cdf } from './CumulativeNormalDistribution'

/**
 * @notice Calculates a common expression
 * @param sigma Volatility as a float
 * @param tau Time until expiry, in years, as a float
 * @returns volatilty * sqrt(tau)
 */
export function getProportionalVol(sigma: number, tau: number): number {
  return sigma * Math.sqrt(tau)
}

/**
 * @notice Core math trading function of the AMM to calculate the stable reserve using risky
 * @param invariantLast Previous invariant with the same `tau` input as the parameter `tau`
 * @param reserveRisky Pool's reserve of risky tokens
 * @param liquidity Pool total supply of liquidity (units of replication)
 * @param strike Price point that defines complete stable token composition of the pool
 * @param sigma Implied volatility of the pool
 * @param tau Time until expiry
 * @param fee Fee to charge on the way in
 * @returns Covered Call AMM black-scholes trading function
 */
export function getTradingFunction(
  invariantLast: number = 0,
  reserveRisky: number,
  liquidity: number,
  strike: number,
  sigma: number,
  tau: number,
  fee: number = 0
): number {
  const K = strike
  const vol = getProportionalVol(sigma, tau)
  if (vol <= 0) return 0
  const gamma: number = 1 - fee
  const reserve: number = (reserveRisky * gamma) / liquidity
  const inverseInput: number = 1 - +reserve
  const phi: number = inverse_std_n_cdf(inverseInput)
  const input = phi - vol
  const reserveStable = K * std_n_cdf(input) + invariantLast
  return reserveStable
}

/**
 * @notice Core math trading function of the AMM to calculate the risky reserve using stable
 * @param invariantLast Previous invariant with the same `tau` input as the parameter `tau`
 * @param reserveStable Pool's reserve of stable tokens
 * @param liquidity Pool total supply of liquidity (units of replication)
 * @param strike Price point that defines complete stable token composition of the pool
 * @param sigma Implied volatility of the pool
 * @param tau Time until expiry
 * @param fee Fee to charge on the way in
 * @returns Covered Call AMM black-scholes inverse trading function
 */
export function getInverseTradingFunction(
  invariantLast: number = 0,
  reserveStable: number,
  liquidity: number,
  strike: number,
  sigma: number,
  tau: number,
  fee: number = 0
): number {
  const K = strike
  const vol = getProportionalVol(sigma, tau)
  if (vol <= 0) return 0
  const gamma: number = 1 - fee
  const reserve: number = (reserveStable * gamma) / liquidity
  const inverseInput: number = (reserve - invariantLast) / K
  const phi: number = inverse_std_n_cdf(inverseInput)
  const input = phi + vol
  const reserveRisky = 1 - std_n_cdf(input)
  return reserveRisky
}

/**
 * @returns Invariant = Reserve stable - getTradingFunction(...)
 */
export function calcInvariant(
  reserveRisky: number,
  reserveStable: number,
  liquidity: number,
  strike: number,
  sigma: number,
  tau: number
): number {
  const input: number = getTradingFunction(0, reserveRisky, liquidity, strike, sigma, tau)
  const invariant: number = reserveStable - input
  return invariant
}
