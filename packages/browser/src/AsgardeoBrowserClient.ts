import {AsgardeoClient, User} from '@asgardeo/javascript';
import {AsgardeoBrowserConfig} from './models/config';

/**
 * Base class for implementing Asgardeo in browser-based applications.
 * This class provides the core functionality for managing user authentication and sessions.
 *
 * @template T - Configuration type that extends AsgardeoBrowserConfig
 * @implements {AsgardeoClient<T>}
 */
abstract class AsgardeoBrowserClient<T = AsgardeoBrowserConfig> implements AsgardeoClient<T> {
  /**
   * Retrieves the currently authenticated user's information.
   *
   * @returns {Promise<User>} A promise that resolves with the user's information
   */
  abstract getUser(): Promise<User>;

  /**
   * Initializes the client with the provided configuration.
   *
   * @param {T} config - The configuration object for the client
   * @returns {Promise<boolean>} A promise that resolves to true if initialization is successful
   */
  abstract initialize(config: T): Promise<boolean>;

  /**
   * Checks if a user is currently signed in.
   *
   * @returns {Promise<boolean>} A promise that resolves to true if a user is signed in
   */
  abstract isSignedIn(): Promise<boolean>;

  /**
   * Initiates the sign-in process for the user.
   *
   * @param {Record<string, unknown>} [config] - Optional configuration for the sign-in process
   * @returns {Promise<User>} A promise that resolves with the signed-in user's information
   */
  abstract signIn(config?: Record<string, unknown>): Promise<User>;

  /**
   * Signs out the currently authenticated user.
   *
   * @returns {Promise<boolean>} A promise that resolves to true if sign-out is successful
   */
  abstract signOut(): Promise<boolean>;
}

export default AsgardeoBrowserClient;
