<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="1.0">
    
    <xsl:output method="text"/>
    <xsl:strip-space elements="*"/>
    <xsl:param name="planet" select="'Saturn'"/>
    
    <xsl:template match="planetary-system">
        <xsl:apply-templates select="//object[@name=$planet]"/>
    </xsl:template>
    
    <xsl:template match="star">
        <xsl:text>    "</xsl:text>
        <xsl:value-of select="name()"/>
        <xsl:text>":{
    </xsl:text>
        <xsl:apply-templates select="@*"/>
        <xsl:text>}</xsl:text>
        <xsl:choose><xsl:when test="position() != last()">
        <xsl:text>,
</xsl:text>
        </xsl:when>
            <xsl:otherwise>
        <xsl:text>
</xsl:text>        
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="planets|comets|satellites|tnos|centaurs|asteroids">
        <xsl:text>    "</xsl:text>
        <xsl:value-of select="name()"/>
        <xsl:text>":[
    </xsl:text>
        <xsl:apply-templates select="object|satellite"/>
        <xsl:text>]</xsl:text>
        <xsl:choose><xsl:when test="position() != last()">
        <xsl:text>,
</xsl:text>
        </xsl:when>
            <xsl:otherwise>
        <xsl:text>
</xsl:text>        
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="satellites">
        <xsl:text>        "</xsl:text>
        <xsl:value-of select="name()"/>
        <xsl:text>":[
    </xsl:text>
        <xsl:apply-templates select="satellite"/>
        <xsl:text>        ]</xsl:text>
        <xsl:choose><xsl:when test="position() != last()">
        <xsl:text>,
    </xsl:text>
        </xsl:when>
            <xsl:otherwise>
        <xsl:text>
    </xsl:text>        
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="object">
        <xsl:text>    </xsl:text>
        <xsl:text>{
    </xsl:text>
        <xsl:apply-templates select="@*"/><xsl:text>,
    </xsl:text>
        <xsl:apply-templates select="satellites"/>
        <xsl:text>    }</xsl:text>
        <xsl:choose><xsl:when test="position() != last()">
        <xsl:text>,
    </xsl:text>
        </xsl:when>
            <xsl:otherwise>
        <xsl:text>
    </xsl:text>        
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="@*">
        <xsl:text>        "</xsl:text>
        <xsl:value-of select="name()"/>
        <xsl:text>":</xsl:text>
        <xsl:if test="number(.) != .">
            <!-- myNode is not a number -->
            <xsl:text>"</xsl:text>
        </xsl:if>
        <xsl:value-of select="."/>
        <xsl:if test="number(.) != .">
            <!-- myNode is not a number -->
            <xsl:text>"</xsl:text>
        </xsl:if>
        <xsl:choose><xsl:when test="position() != last()">
        <xsl:text>,
    </xsl:text>
        </xsl:when>
            <xsl:otherwise>
        <xsl:text>
    </xsl:text>        
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="satellite/@*">
        <xsl:text>    "</xsl:text>
        <xsl:value-of select="name()"/>
        <xsl:text>":</xsl:text>
        <xsl:if test="number(.) != .">
            <!-- myNode is not a number -->
            <xsl:text>"</xsl:text>
        </xsl:if>
        <xsl:value-of select="."/>
        <xsl:if test="number(.) != .">
            <!-- myNode is not a number -->
            <xsl:text>"</xsl:text>
        </xsl:if>
        <xsl:choose><xsl:when test="position() != last()">
        <xsl:text>,
                </xsl:text>
        </xsl:when>
            <xsl:otherwise>
                <xsl:text>
        </xsl:text>        
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="star/@*">
        <xsl:text>    "</xsl:text>
        <xsl:value-of select="name()"/>
        <xsl:text>":</xsl:text>
        <xsl:if test="number(.) != .">
            <!-- myNode is not a number -->
            <xsl:text>"</xsl:text>
        </xsl:if>
        <xsl:value-of select="."/>
        <xsl:if test="number(.) != .">
            <!-- myNode is not a number -->
            <xsl:text>"</xsl:text>
        </xsl:if>
        <xsl:choose><xsl:when test="position() != last()">
        <xsl:text>,
    </xsl:text>
        </xsl:when>
            <xsl:otherwise>
        <xsl:text>
    </xsl:text>        
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="satellite">
        <xsl:text>            </xsl:text>
        <xsl:text>{
                </xsl:text>
        <xsl:apply-templates select="@*"/>
        <xsl:text>        }</xsl:text>
        <xsl:choose><xsl:when test="position() != last()">
        <xsl:text>,
    </xsl:text>
        </xsl:when>
            <xsl:otherwise>
                <xsl:text>
    </xsl:text>        
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
</xsl:stylesheet>