package org.red.webframe.common.security;

/**
 * SHA512证书加密
 * 
 */
public class SHA512CredentialsDigest extends HashCredentialsDigest implements
		CredentialsDigest {
	@Override
	protected byte[] digest(byte[] input, byte[] salt) {
		return Digests.sha512(input, salt, HASH_INTERATIONS);
	}
}