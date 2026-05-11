<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>
    
    <!-- Prints the root node and selects all descendant nodes -->
    <xsl:template match="/">
        <xsl:text>/</xsl:text>
        <xsl:apply-templates select="descendant::node()" mode="print-path"/>
    </xsl:template>
    
    <!-- Prints a new line and the root document element -->
    <xsl:template match="*[not(parent::*)]" mode="print-path">
        <xsl:text>&#xa;/</xsl:text>
        <xsl:value-of select="name()"/>
        <xsl:text>[1]</xsl:text>
    </xsl:template>
    
    <!-- Prints any element that has a parent element -->
    <xsl:template match="*[parent::*]" mode="print-path">
        <xsl:apply-templates select="parent::*" mode="print-path"/>
        <xsl:variable name="name" select="name()"/>
        <xsl:text>/</xsl:text>
        <xsl:value-of select="$name"/>
        <xsl:text>[</xsl:text>
        <xsl:value-of select="count(preceding-sibling::*[name()=$name])+1" />
        <xsl:text>]</xsl:text>
    </xsl:template>
    
    <!-- Prints a text node -->
    <xsl:template match="text()[parent::node()]" mode="print-path">
        <xsl:apply-templates select="parent::*" mode="print-path"/>
        <xsl:text>/text()[</xsl:text>
        <xsl:value-of select="count(preceding-sibling::text())+1" />
        <xsl:text>] - "</xsl:text>
        <xsl:value-of select="."/>
        <xsl:text>"</xsl:text>
    </xsl:template>
    
    <!-- Prints a comment -->
    <xsl:template match="comment()[parent::node()]" mode="print-path">
        <xsl:apply-templates select="parent::*" mode="print-path"/>
        <xsl:text>/comment()[</xsl:text>
        <xsl:value-of select="count(preceding-sibling::comment())+1" />
        <xsl:text>]</xsl:text>
    </xsl:template>
    
    <!-- Prints a processing instruction -->
    <xsl:template match="processing-instruction()[parent::node()]" mode="print-path">
        <xsl:apply-templates select="parent::*" mode="print-path"/>
        <xsl:text>/processing-instruction(</xsl:text>
        <xsl:value-of select="name()"/>
        <xsl:text>)[</xsl:text>
        <xsl:value-of select="count(preceding-sibling::processing-instruction())+1" />
        <xsl:text>]</xsl:text>
    </xsl:template>
    
</xsl:stylesheet>