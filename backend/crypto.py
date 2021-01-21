# created a new file which will handle the crpytography of the login
from random import seed
from random import random
from Crypto.Hash import SHA3_512
import secrets, string, os

#make salt
@staticmethod
def salt():
    return os.urandom(16) # byte 16

#hash password
@staticmethod
def hashPassword(plainPassword):
    hashObject = SHA3_512.new()
    hashObject.update(plainPassword)
    return hashObject.digest()

#for improved security we have to combine the password some salt
@staticmethod
def hashSalted(hashedPass, salt):
    combinedPass = hashedPass + salt
    hashObjectNew = SHA3_512.new()
    hashObjectNew.update(combinedPass)
    return hashObjectNew.digest()

#this method is to compare the passwords to ensure the login is valid

def compareHash(expectedPass, inputPass, inputSalt):
    generateInputSalt = hashSalted(inputPass,inputSalt)
    return expectedPass is generateInputSalt # comparing if they are the same