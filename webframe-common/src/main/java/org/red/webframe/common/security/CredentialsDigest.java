package org.red.webframe.common.security;

/**
 * 证书加密
 * 
 */
public interface CredentialsDigest {
	public String digest(String plainCredentials, byte[] salt);

	public boolean matches(String credentials, String plainCredentials,
                           byte[] salt);
}
